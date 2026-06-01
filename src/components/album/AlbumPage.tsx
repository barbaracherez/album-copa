"use client";

import { motion } from "framer-motion";
import { Sticker, UserSticker, SECTIONS } from "@/types";
import StickerSlot from "@/components/sticker/StickerSlot";

interface AlbumPageProps {
  section: string;
  stickers: Sticker[];
  userStickers: UserSticker[];
  onPlaceSticker: (stickerId: string) => void;
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

export default function AlbumPage({ section, stickers, userStickers, onPlaceSticker }: AlbumPageProps) {
  const sectionInfo = SECTIONS[section];
  const sectionColor = SECTION_COLORS[section] || "#006633";

  const userStickerMap = new Map(userStickers.map((us) => [us.stickerId, us]));

  const placedCount = userStickers.filter((us) =>
    stickers.some((s) => s.id === us.stickerId) && us.placedInAlbum
  ).length;
  const ownedCount = userStickers.filter((us) => stickers.some((s) => s.id === us.stickerId)).length;
  const totalCount = stickers.length;
  const progress = totalCount > 0 ? (placedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      className="bg-white rounded-3xl overflow-hidden shadow-xl border-t-8"
      style={{ borderTopColor: sectionColor }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Section header */}
      <div
        className="px-6 py-5 flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, ${sectionColor}22, ${sectionColor}11)` }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
          style={{ background: sectionColor }}
        >
          {sectionInfo?.emoji || "⭐"}
        </div>
        <div className="flex-1">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "'Bebas Neue', sans-serif", color: sectionColor }}
          >
            {sectionInfo?.label || section}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: sectionColor }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">
              {placedCount}/{totalCount} coladas
            </span>
            {ownedCount > placedCount && (
              <span className="text-xs text-orange-500 font-semibold">
                ({ownedCount - placedCount} para colar)
              </span>
            )}
          </div>
        </div>
        {progress === 100 && (
          <div className="bg-yellow-400 text-green-900 font-bold px-3 py-1 rounded-full text-sm"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            COMPLETO! 🏆
          </div>
        )}
      </div>

      {/* Sticker grid */}
      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {stickers.map((sticker) => {
            const userSticker = userStickerMap.get(sticker.id);
            return (
              <StickerSlot
                key={sticker.id}
                number={sticker.number}
                section={section}
                sticker={sticker}
                owned={!!userSticker}
                placed={userSticker?.placedInAlbum}
                quantity={userSticker?.quantity}
                onPlace={() => onPlaceSticker(sticker.id)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
