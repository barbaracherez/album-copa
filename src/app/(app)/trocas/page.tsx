"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Trade, Sticker, UserSticker } from "@/types";
import TradeCard from "@/components/trades/TradeCard";
import { ArrowLeftRight, Plus, X } from "lucide-react";
import { SECTIONS } from "@/types";
import StickerCard from "@/components/sticker/StickerCard";

export default function TrocasPage() {
  const { data: session } = useSession();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userStickers, setUserStickers] = useState<UserSticker[]>([]);
  const [allStickers, setAllStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [offerSticker, setOfferSticker] = useState<Sticker | null>(null);
  const [wantSticker, setWantSticker] = useState<Sticker | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"open" | "mine">("open");

  const userId = (session?.user as any)?.id;

  async function fetchAll() {
    const [tradesRes, albumRes] = await Promise.all([
      fetch("/api/trades?filter=open"),
      fetch("/api/album"),
    ]);
    const tradesData = await tradesRes.json();
    const albumData = await albumRes.json();
    setTrades(tradesData.trades || []);
    setUserStickers(albumData.userStickers || []);
    setAllStickers(albumData.allStickers || []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  const extras = userStickers.filter((us) => us.quantity >= 2);
  const myTrades = trades.filter((t) => t.fromUserId === userId);
  const otherTrades = trades.filter((t) => t.fromUserId !== userId);

  async function createTrade() {
    if (!offerSticker) return;
    setSubmitting(true);
    await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offeredStickerId: offerSticker.id,
        wantedStickerId: wantSticker?.id || null,
        message,
      }),
    });
    setShowCreate(false);
    setOfferSticker(null);
    setWantSticker(null);
    setMessage("");
    setSubmitting(false);
    fetchAll();
  }

  async function handleAction(tradeId: string, action: string) {
    await fetch(`/api/trades/${tradeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchAll();
  }

  const displayTrades = tab === "mine" ? myTrades : otherTrades;

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bebas text-4xl text-green-800 tracking-wide mb-1">🔄 TROCAS</h1>
          <p className="text-gray-500 text-sm">Troque figurinhas repetidas com seus colegas!</p>
        </div>
        <motion.button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-4 h-4" />
          Oferecer Troca
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["open", "mine"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
              tab === t ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t === "open" ? `Disponíveis (${otherTrades.length})` : `Minhas Ofertas (${myTrades.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayTrades.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhuma troca disponível.</p>
          <p className="text-sm">
            {tab === "open" ? "Colegas ainda não ofertaram figurinhas." : "Você ainda não ofertou nenhuma troca."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayTrades.map((trade) => {
            const isMine = trade.fromUserId === userId;
            const myOwned = trade.wantedSticker
              ? userStickers.find((us) => us.sticker.id === trade.wantedSticker!.id && us.quantity >= 2)
              : null;
            return (
              <TradeCard
                key={trade.id}
                trade={trade}
                isMine={isMine}
                canAccept={!isMine && !!myOwned}
                onAccept={() => handleAction(trade.id, "accept")}
                onCancel={() => handleAction(trade.id, "cancel")}
              />
            );
          })}
        </div>
      )}

      {/* Create trade modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bebas text-2xl text-green-800 tracking-wide">NOVA TROCA</h3>
              <button onClick={() => setShowCreate(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Offer */}
            <div className="mb-4">
              <p className="font-semibold text-gray-700 mb-2">Figurinha que você oferece (repetida):</p>
              {extras.length === 0 ? (
                <p className="text-gray-400 text-sm">Você não tem figurinhas repetidas no momento.</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {extras.map((us) => (
                    <div
                      key={us.id}
                      onClick={() => setOfferSticker(us.sticker)}
                      className={`cursor-pointer rounded-xl border-2 transition-all ${
                        offerSticker?.id === us.sticker.id ? "border-green-500 scale-105" : "border-transparent"
                      }`}
                    >
                      <StickerCard sticker={us.sticker} compact quantity={us.quantity} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Want */}
            <div className="mb-4">
              <p className="font-semibold text-gray-700 mb-2">Figurinha que você quer (opcional):</p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {allStickers
                  .filter((s) => !userStickers.find((us) => us.sticker.id === s.id))
                  .map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setWantSticker(wantSticker?.id === s.id ? null : s)}
                      className={`cursor-pointer rounded-xl border-2 transition-all ${
                        wantSticker?.id === s.id ? "border-orange-500 scale-105" : "border-transparent"
                      }`}
                    >
                      <StickerCard sticker={s} compact />
                    </div>
                  ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Mensagem (opcional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-4 outline-none focus:border-green-400"
            />

            <button
              onClick={createTrade}
              disabled={!offerSticker || submitting}
              className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bebas text-xl tracking-wide py-3 rounded-xl"
            >
              {submitting ? "PUBLICANDO..." : "PUBLICAR OFERTA"}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
