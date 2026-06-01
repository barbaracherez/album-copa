"use client";

import { motion } from "framer-motion";
import { Trade, SECTIONS } from "@/types";
import { ArrowRight, Check, X, User } from "lucide-react";
import { useSession } from "next-auth/react";

interface TradeCardProps {
  trade: Trade;
  isMine?: boolean;
  canAccept?: boolean;
  onAccept?: (tradeId: string) => void;
  onReject?: (tradeId: string) => void;
  onCancel?: (tradeId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Aberta",
  pending: "Pendente",
  accepted: "Aceita",
  rejected: "Recusada",
  cancelled: "Cancelada",
};

const SECTION_COLORS: Record<string, string> = {
  historia: "#006633",
  unidades: "#0066CC",
  diretoria: "#FFB800",
  areas: "#FF6B00",
  premios: "#9B59B6",
  momentos: "#E74C3C",
  colaboradores: "#27AE60",
  brasil2026: "#FFD700",
  selecao: "#006633",
};

function MiniSticker({ sticker, label }: { sticker: any; label: string }) {
  const sectionColor = SECTION_COLORS[sticker.section] || "#006633";
  const sectionInfo = SECTIONS[sticker.section];
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs text-gray-400 font-semibold uppercase">{label}</p>
      <div
        className="w-20 h-28 rounded-xl overflow-hidden border-2 shadow-sm"
        style={{ borderColor: sectionColor }}
      >
        <div
          className="w-full h-14 flex items-center justify-center text-2xl"
          style={{ background: `linear-gradient(135deg, ${sectionColor}dd, ${sectionColor}66)` }}
        >
          {sectionInfo?.emoji || "⭐"}
        </div>
        <div className="p-1 bg-white">
          <p className="text-gray-400 text-xs">#{sticker.number}</p>
          <p className="text-gray-800 text-xs font-bold leading-tight">{sticker.name}</p>
        </div>
      </div>
    </div>
  );
}

export default function TradeCard({ trade, isMine, canAccept, onAccept, onReject, onCancel }: TradeCardProps) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const isOwner = trade.fromUserId === userId;
  const isTarget = trade.toUserId === userId;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-bold">
            {trade.fromUser?.name?.[0] || "U"}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{trade.fromUser?.name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[trade.status]}`}>
              {STATUS_LABELS[trade.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Stickers */}
      <div className="flex items-center justify-center gap-4 my-4">
        {trade.offeredSticker && (
          <MiniSticker sticker={trade.offeredSticker} label="Oferece" />
        )}
        <ArrowRight className="w-6 h-6 text-gray-400" />
        {trade.wantedSticker ? (
          <MiniSticker sticker={trade.wantedSticker} label="Quer" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-gray-400 font-semibold uppercase">Quer</p>
            <div className="w-20 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <p className="text-gray-300 text-xs text-center">Qualquer figurinha</p>
            </div>
          </div>
        )}
      </div>

      {trade.message && (
        <p className="text-gray-500 text-sm italic bg-gray-50 rounded-xl px-3 py-2 mb-3">
          "{trade.message}"
        </p>
      )}

      {/* Actions */}
      {trade.status === "open" && (
        <div className="flex gap-2">
          {!isOwner && onAccept && (
            <motion.button
              onClick={() => onAccept(trade.id)}
              className="flex-1 flex items-center justify-center gap-1 bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded-xl text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="w-4 h-4" /> Aceitar
            </motion.button>
          )}
          {!isOwner && onReject && (
            <motion.button
              onClick={() => onReject(trade.id)}
              className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
          {isOwner && onCancel && (
            <motion.button
              onClick={() => onCancel(trade.id)}
              className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-xl text-sm transition-colors w-full"
              whileHover={{ scale: 1.02 }}
            >
              <X className="w-4 h-4" /> Cancelar
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
