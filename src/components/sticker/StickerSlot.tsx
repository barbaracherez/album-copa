"use client";

import { motion } from "framer-motion";
import { Sticker } from "@/types";
import { SECTIONS } from "@/types";
import { Lock } from "lucide-react";

interface StickerSlotProps {
  number?: number;
  section?: string;
  sticker?: Sticker;
  owned?: boolean;
  placed?: boolean;
  quantity?: number;
  onPlace?: () => void;
}

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

export default function StickerSlot({ number, section, sticker, owned, placed, quantity, onPlace }: StickerSlotProps) {
  const resolvedSection = section || sticker?.section || "historia";
  const resolvedNumber = number ?? sticker?.number ?? 0;
  const sectionColor = SECTION_COLORS[resolvedSection] || "#006633";
  const sectionInfo = SECTIONS[resolvedSection];

  if (!owned || !sticker) {
    // Empty slot
    return (
      <div
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-gray-50 sticker-slot-empty"
        style={{ borderColor: `${sectionColor}44`, width: 88, height: 120 }}
      >
        <Lock className="w-5 h-5 text-gray-300 mb-1" />
        <span className="text-gray-300 text-xs font-bold">#{resolvedNumber}</span>
        <span className="text-gray-200 text-xs text-center px-1 leading-tight mt-0.5">
          {sticker?.name || `Figurinha ${resolvedNumber}`}
        </span>
      </div>
    );
  }

  if (placed) {
    return (
      <motion.div
        className="relative rounded-xl overflow-hidden shadow-md"
        style={{ width: 80, height: 110, border: `3px solid ${sectionColor}` }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div
          className="w-full h-16 flex items-center justify-center text-3xl"
          style={{ background: `linear-gradient(135deg, ${sectionColor}dd, ${sectionColor}66)` }}
        >
          {sectionInfo?.emoji || "⭐"}
        </div>
        <div className="p-1 bg-white h-full">
          <p className="text-gray-400 text-xs">#{number}</p>
          <p className="text-gray-800 text-xs font-bold leading-tight">{sticker.name}</p>
          {sticker.rarity === "gold" && <p className="text-yellow-600 text-xs">⭐ Ouro</p>}
          {sticker.rarity === "rare" && <p className="text-purple-600 text-xs">✨ Rara</p>}
        </div>
        <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      </motion.div>
    );
  }

  // Owned but not placed
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shadow-md border-2 border-orange-400 cursor-pointer"
      style={{ width: 88, height: 120 }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onPlace}
    >
      <div
        className="w-full h-16 flex items-center justify-center text-3xl"
        style={{ background: `linear-gradient(135deg, ${sectionColor}dd, ${sectionColor}66)` }}
      >
        {sectionInfo?.emoji || "⭐"}
      </div>
      <div className="p-1 bg-white">
        <p className="text-gray-400 text-xs">#{number}</p>
        <p className="text-gray-800 text-xs font-bold leading-tight">{sticker.name}</p>
      </div>
      {/* "Place" button overlay */}
      <div className="absolute inset-0 bg-orange-400/0 hover:bg-orange-400/20 transition-colors flex items-end justify-center pb-1">
        <span className="text-orange-600 text-xs font-bold bg-orange-100 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100">
          COLAR
        </span>
      </div>
      {quantity && quantity > 1 && (
        <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {quantity}
        </div>
      )}
    </motion.div>
  );
}
