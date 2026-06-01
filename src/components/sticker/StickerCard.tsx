"use client";

import { motion } from "framer-motion";
import { Sticker } from "@/types";
import { SECTIONS } from "@/types";
import { Star, Sparkles } from "lucide-react";

interface StickerCardProps {
  sticker: Sticker;
  quantity?: number;
  isPlaced?: boolean;
  compact?: boolean;
  onClick?: () => void;
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

// Deterministic color from sticker number for placeholder images
function getStickerColor(number: number): string {
  const colors = ["3b82f6", "ef4444", "10b981", "f59e0b", "8b5cf6", "ec4899", "06b6d4", "f97316"];
  return colors[number % colors.length];
}

export default function StickerCard({ sticker, quantity, isPlaced, compact = false, onClick }: StickerCardProps) {
  const sectionColor = SECTION_COLORS[sticker.section] || "#006633";
  const sectionInfo = SECTIONS[sticker.section];
  const imgSeed = sticker.number + 100;

  const cardClasses = {
    normal: "border-2",
    rare: "border-4 shimmer-rare",
    gold: "border-4 glow-gold",
  }[sticker.rarity];

  const borderStyle = {
    normal: { borderColor: sectionColor },
    rare: { borderColor: "#9B59B6" },
    gold: { borderColor: "#FFB800" },
  }[sticker.rarity];

  if (compact) {
    return (
      <motion.div
        onClick={onClick}
        className={`relative rounded-xl overflow-hidden cursor-pointer bg-white ${cardClasses}`}
        style={{ ...borderStyle, width: 80, height: 110 }}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="w-full h-14 flex items-center justify-center text-white text-2xl font-bold"
          style={{ background: sectionColor }}
        >
          {sectionInfo?.emoji || "⭐"}
        </div>
        <div className="p-1">
          <p className="text-gray-400 text-xs">#{sticker.number}</p>
          <p className="text-gray-800 text-xs font-semibold leading-tight line-clamp-2">{sticker.name}</p>
        </div>
        {sticker.rarity === "gold" && (
          <div className="absolute top-0.5 right-0.5">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          </div>
        )}
        {quantity && quantity > 1 && (
          <div className="absolute bottom-0.5 right-0.5 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {quantity}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer ${cardClasses}`}
      style={{ ...borderStyle, width: 140, minHeight: 200 }}
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Rarity badge */}
      {sticker.rarity !== "normal" && (
        <div
          className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-xs font-bold"
          style={{
            background: sticker.rarity === "gold" ? "#FFB800" : "#9B59B6",
            color: sticker.rarity === "gold" ? "#1a0a00" : "white",
          }}
        >
          {sticker.rarity === "gold" ? "⭐ OURO" : "✨ RARA"}
        </div>
      )}

      {/* Sticker image */}
      <div
        className="w-full h-28 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${sectionColor}dd, ${sectionColor}88)` }}
      >
        <div className="text-5xl">{sectionInfo?.emoji || "⭐"}</div>
        <div
          className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center text-white/80 text-xs font-bold"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          {sectionInfo?.label || sticker.section}
        </div>
      </div>

      {/* Sticker info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <span className="text-gray-400 text-xs font-bold">#{sticker.number}</span>
          {sticker.rarity === "gold" && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          {sticker.rarity === "rare" && <Sparkles className="w-4 h-4 text-purple-500" />}
        </div>
        <h3 className="text-gray-900 text-sm font-bold leading-tight mb-1">{sticker.name}</h3>
        {sticker.description && (
          <p className="text-gray-500 text-xs leading-tight line-clamp-2">{sticker.description}</p>
        )}
      </div>

      {/* Quantity badge */}
      {quantity && quantity > 1 && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {quantity}
        </div>
      )}

      {/* Placed indicator */}
      {isPlaced && (
        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full rotate-12">
            COLADA ✓
          </div>
        </div>
      )}
    </motion.div>
  );
}
