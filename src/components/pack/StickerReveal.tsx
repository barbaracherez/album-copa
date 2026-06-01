"use client";

import { motion } from "framer-motion";
import { Sticker, SECTIONS } from "@/types";
import { Star, Sparkles, ChevronRight } from "lucide-react";

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

interface StickerRevealProps {
  sticker: Sticker;
  index: number;
  total: number;
  onNext: () => void;
}

export default function StickerReveal({ sticker, index, total, onNext }: StickerRevealProps) {
  const sectionColor = SECTION_COLORS[sticker.section] || "#006633";
  const sectionInfo = SECTIONS[sticker.section];

  const isGold = sticker.rarity === "gold";
  const isRare = sticker.rarity === "rare";

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Rarity announcement */}
      {(isGold || isRare) && (
        <motion.div
          className={`text-2xl font-bold px-6 py-2 rounded-full ${
            isGold ? "bg-yellow-400 text-green-900" : "bg-purple-500 text-white"
          }`}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
        >
          {isGold ? "⭐ FIGURINHA OURO! ⭐" : "✨ FIGURINHA RARA! ✨"}
        </motion.div>
      )}

      {/* Sticker card */}
      <motion.div
        className={`relative rounded-3xl overflow-hidden shadow-2xl ${
          isGold ? "glow-gold border-4 border-yellow-400" :
          isRare ? "border-4 border-purple-500" :
          "border-3 border-gray-200"
        }`}
        style={{ width: 200, minHeight: 280 }}
        initial={{ rotateY: 90, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Background gradients for rare/gold */}
        {isGold && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-100 to-orange-200 opacity-50" />
        )}
        {isRare && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-purple-100 to-blue-200 opacity-50" />
        )}

        {/* Image area */}
        <div
          className="w-full h-40 flex items-center justify-center relative"
          style={{ background: `linear-gradient(135deg, ${sectionColor}ee, ${sectionColor}88)` }}
        >
          <div className="text-7xl">{sectionInfo?.emoji || "⭐"}</div>
          {isGold && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
        </div>

        {/* Info */}
        <div className="p-4 bg-white relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-bold">#{sticker.number}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${sectionColor}22`, color: sectionColor }}
            >
              {sectionInfo?.label || sticker.section}
            </span>
          </div>
          <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">{sticker.name}</h3>
          {sticker.description && (
            <p className="text-gray-500 text-sm">{sticker.description}</p>
          )}
          {isGold && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-600 text-sm font-bold">Figurinha Ouro</span>
            </div>
          )}
          {isRare && (
            <div className="flex items-center gap-1 mt-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-purple-600 text-sm font-bold">Figurinha Rara</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Counter + Next */}
      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-sm">
          {index + 1} de {total}
        </span>
        <motion.button
          onClick={onNext}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {index < total - 1 ? (
            <>PRÓXIMA <ChevronRight className="w-4 h-4" /></>
          ) : (
            "CONCLUIR ✓"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
