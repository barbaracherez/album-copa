"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sticker } from "@/types";
import StickerCard from "@/components/sticker/StickerCard";
import { Package, Clock, Sparkles } from "lucide-react";

type Phase = "check" | "ready" | "opening" | "reveal" | "done";

function formatCountdown(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PackPage() {
  const [phase, setPhase] = useState<Phase>("check");
  const [nextPackAt, setNextPackAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    checkPackStatus();
  }, []);

  useEffect(() => {
    if (!nextPackAt) return;
    const id = setInterval(() => {
      const diff = nextPackAt.getTime() - Date.now();
      if (diff <= 0) { checkPackStatus(); return; }
      setCountdown(formatCountdown(diff));
    }, 1000);
    return () => clearInterval(id);
  }, [nextPackAt]);

  async function checkPackStatus() {
    const res = await fetch("/api/pack/open");
    const data = await res.json();
    if (data.canOpen) {
      setPhase("ready");
    } else {
      setNextPackAt(new Date(data.nextPackAt));
      setPhase("check");
    }
  }

  async function openPack() {
    setLoading(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
    setPhase("opening");

    await new Promise((r) => setTimeout(r, 1500));

    const res = await fetch("/api/pack/open", { method: "POST" });
    if (!res.ok) {
      setPhase("ready");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setStickers(data.stickers);
    setRevealIndex(0);
    setPhase("reveal");
    setLoading(false);
  }

  function nextSticker() {
    if (revealIndex < stickers.length - 1) {
      setRevealIndex((i) => i + 1);
    } else {
      setPhase("done");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <AnimatePresence mode="wait">

        {/* WAITING state */}
        {phase === "check" && nextPackAt && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-3xl flex items-center justify-center opacity-50">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="font-bebas text-4xl text-gray-700 tracking-wide mb-2">PRÓXIMO PACOTE</h2>
            <div className="flex items-center gap-2 justify-center text-gray-500 mb-6">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-3xl font-bold text-green-700">{countdown}</span>
            </div>
            <p className="text-gray-500">Volte amanhã para abrir seu próximo pacote com 7 figurinhas!</p>
          </motion.div>
        )}

        {/* READY state */}
        {phase === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <h2 className="font-bebas text-5xl text-green-800 tracking-wide mb-2">PACOTE DISPONÍVEL!</h2>
            <p className="text-gray-600 mb-8">Seu pacote diário com 7 figurinhas está esperando!</p>

            <motion.button
              onClick={openPack}
              disabled={loading}
              className="relative cursor-pointer"
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pack visual */}
              <div className="w-48 h-64 mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #006633, #009933)" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-6xl mb-2">⚽</div>
                  <div className="font-bebas text-2xl tracking-widest">GRUPO</div>
                  <div className="font-bebas text-2xl tracking-widest text-yellow-400">PRESENÇA</div>
                  <div className="font-bebas text-lg tracking-widest mt-1 text-green-300">COPA 2026</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: [-200, 300] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </div>
              <p className="mt-4 font-bebas text-2xl text-green-800 tracking-wide">TOQUE PARA ABRIR</p>
            </motion.button>
          </motion.div>
        )}

        {/* OPENING animation */}
        {phase === "opening" && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              className="w-48 h-64 mx-auto rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #006633, #009933)" }}
              animate={{ scale: [1, 1.1, 0], rotate: [0, 5, 15], opacity: [1, 1, 0] }}
              transition={{ duration: 1.2 }}
            >
              <div className="w-full h-full flex items-center justify-center text-6xl">⚽</div>
            </motion.div>
            <motion.p
              className="mt-6 font-bebas text-3xl text-green-700 tracking-wide"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ABRINDO...
            </motion.p>
          </motion.div>
        )}

        {/* REVEAL stickers one by one */}
        {phase === "reveal" && stickers[revealIndex] && (
          <motion.div
            key={`reveal-${revealIndex}`}
            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center flex flex-col items-center"
          >
            <p className="text-gray-500 mb-4 font-semibold">
              {revealIndex + 1} de {stickers.length}
            </p>
            <StickerCard sticker={stickers[revealIndex]} />
            {stickers[revealIndex].rarity !== "normal" && (
              <motion.div
                className="mt-3 flex items-center gap-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-bebas text-xl text-yellow-600">
                  {stickers[revealIndex].rarity === "gold" ? "FIGURINHA DOURADA!" : "FIGURINHA RARA!"}
                </span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </motion.div>
            )}
            <motion.button
              onClick={nextSticker}
              className="mt-6 bg-green-700 hover:bg-green-600 text-white font-bebas text-xl tracking-wide px-8 py-3 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {revealIndex < stickers.length - 1 ? "PRÓXIMA →" : "VER TODAS ✓"}
            </motion.button>
          </motion.div>
        )}

        {/* DONE — show all */}
        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full max-w-lg"
          >
            <h2 className="font-bebas text-4xl text-green-800 tracking-wide mb-1">VOCÊ GANHOU!</h2>
            <p className="text-gray-600 mb-6">Suas {stickers.length} figurinhas de hoje:</p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {stickers.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <StickerCard sticker={s} compact />
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <a href="/album" className="bg-green-700 hover:bg-green-600 text-white font-bebas text-lg tracking-wide px-6 py-3 rounded-xl">
                VER MEU ÁLBUM
              </a>
              <a href="/trocas" className="bg-orange-500 hover:bg-orange-400 text-white font-bebas text-lg tracking-wide px-6 py-3 rounded-xl">
                TROCAR FIGURINHAS
              </a>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
