"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS, Sticker, UserSticker } from "@/types";
import StickerCard from "@/components/sticker/StickerCard";
import StickerSlot from "@/components/sticker/StickerSlot";
import PageCompleteModal from "@/components/album/PageCompleteModal";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

type SectionKey = keyof typeof SECTIONS;

const SECTION_KEYS = Object.keys(SECTIONS) as SectionKey[];

export default function AlbumPage() {
  const [allStickers, setAllStickers] = useState<Sticker[]>([]);
  const [userStickers, setUserStickers] = useState<UserSticker[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState<string | null>(null);
  const [completedSection, setCompletedSection] = useState<string | null>(null);

  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/album");
    const data = await res.json();
    setAllStickers(data.allStickers);
    setUserStickers(data.userStickers);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  const sectionKey = SECTION_KEYS[currentSection];
  const sectionInfo = SECTIONS[sectionKey];
  const sectionStickers = allStickers.filter((s) => s.section === sectionKey);

  const getUserSticker = (stickerId: string) =>
    userStickers.find((us) => us.sticker.id === stickerId);

  const placedCount = sectionStickers.filter((s) => {
    const us = getUserSticker(s.id);
    return us?.placedInAlbum;
  }).length;

  const ownedNotPlaced = sectionStickers.filter((s) => {
    const us = getUserSticker(s.id);
    return us && !us.placedInAlbum;
  });

  const isSectionComplete = placedCount === sectionStickers.length && sectionStickers.length > 0;

  async function placeSticker(stickerId: string) {
    setPlacing(stickerId);
    await fetch("/api/stickers/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stickerId }),
    });
    await fetchAlbum();
    setPlacing(null);

    const updated = userStickers.map((us) =>
      us.sticker.id === stickerId ? { ...us, placedInAlbum: true } : us
    );
    const sectionAfter = sectionStickers.filter((s) => {
      const us = updated.find((u) => u.sticker.id === s.id);
      return us?.placedInAlbum;
    });
    if (sectionAfter.length === sectionStickers.length) {
      setCompletedSection(sectionInfo.label);
    }
  }

  const totalPlaced = userStickers.filter((us) => us.placedInAlbum).length;
  const totalProgress = allStickers.length > 0 ? Math.round((totalPlaced / allStickers.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-cream)" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-6 px-4 mb-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-4xl tracking-wider">MEU ÁLBUM</h1>
            <p className="text-green-300 text-sm">Copa 2026 · Grupo Presença</p>
          </div>
          <div className="text-right">
            <div className="font-bebas text-3xl text-yellow-400">{totalPlaced}/{allStickers.length}</div>
            <div className="text-green-300 text-sm">figurinhas coladas</div>
          </div>
        </div>
        <div className="mt-3 bg-green-950 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-green-400 text-xs mt-1">{totalProgress}% completo</p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {SECTION_KEYS.map((key, i) => {
          const info = SECTIONS[key];
          const sStickers = allStickers.filter((s) => s.section === key);
          const sPlaced = sStickers.filter((s) => getUserSticker(s.id)?.placedInAlbum).length;
          const done = sPlaced === sStickers.length && sStickers.length > 0;
          return (
            <button
              key={key}
              onClick={() => setCurrentSection(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                i === currentSection
                  ? "text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              style={i === currentSection ? { background: info.color } : {}}
            >
              <span>{info.emoji}</span>
              <span>{info.label}</span>
              {done && <CheckCircle className="w-4 h-4" />}
              <span className="text-xs opacity-70">{sPlaced}/{sStickers.length}</span>
            </button>
          );
        })}
      </div>

      {/* Section navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentSection((p) => Math.max(0, p - 1))}
          disabled={currentSection === 0}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-2xl">{sectionInfo.emoji}</span>
            <h2 className="font-bebas text-3xl tracking-wide" style={{ color: sectionInfo.color }}>
              {sectionInfo.label}
            </h2>
            {isSectionComplete && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </motion.div>
            )}
          </div>
          <p className="text-gray-500 text-sm">{placedCount}/{sectionStickers.length} coladas</p>
        </div>
        <button
          onClick={() => setCurrentSection((p) => Math.min(SECTION_KEYS.length - 1, p + 1))}
          disabled={currentSection === SECTION_KEYS.length - 1}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Sticker grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sectionKey}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
          style={{ border: `3px solid ${sectionInfo.color}22` }}
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
              {sectionStickers.map((sticker) => {
                const us = getUserSticker(sticker.id);
                const owned = !!us;
                const placed = us?.placedInAlbum || false;

                return (
                  <div key={sticker.id} className="flex flex-col items-center gap-1">
                    {placed ? (
                      <StickerCard sticker={sticker} compact isPlaced />
                    ) : owned ? (
                      <motion.div
                        className="relative cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => placeSticker(sticker.id)}
                      >
                        <StickerCard sticker={sticker} compact quantity={us?.quantity} />
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-xl border-2 border-yellow-400 border-dashed flex items-end justify-center pb-1">
                          <span className="text-xs bg-yellow-400 text-green-900 font-bold px-1 rounded">
                            {placing === sticker.id ? "..." : "COLAR"}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <StickerSlot sticker={sticker} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Owned but not placed summary */}
      {ownedNotPlaced.length > 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <p className="text-yellow-800 text-sm font-semibold mb-2">
            🎴 Você tem {ownedNotPlaced.length} figurinha(s) desta seção para colar!
          </p>
          <p className="text-yellow-600 text-xs">Clique nas figurinhas destacadas para colá-las no álbum.</p>
        </div>
      )}

      <PageCompleteModal
        isOpen={!!completedSection}
        sectionLabel={completedSection || ""}
        onClose={() => setCompletedSection(null)}
      />
    </div>
  );
}
