"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sticker } from "@/types";
import StickerReveal from "./StickerReveal";

interface PackAnimationProps {
  onOpen: () => Promise<Sticker[]>;
  disabled?: boolean;
}

export default function PackAnimation({ onOpen, disabled }: PackAnimationProps) {
  const [state, setState] = useState<"idle" | "opening" | "revealed">("idle");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setState("opening");

    try {
      await new Promise((r) => setTimeout(r, 800));
      const result = await onOpen();
      setStickers(result);
      setCurrentIndex(0);
      setState("revealed");
    } catch (e) {
      setState("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < stickers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setState("idle");
      setStickers([]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="pack"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0, rotate: 15 }}
          >
            {/* Pack visual */}
            <motion.div
              className={`relative cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              animate={disabled ? {} : { y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              onClick={!disabled ? handleOpen : undefined}
              whileHover={!disabled ? { scale: 1.05 } : {}}
            >
              <div className="w-48 h-72 bg-gradient-to-b from-green-700 to-green-900 rounded-2xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center justify-center overflow-hidden relative">
                {/* Pack shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                {/* Pack number strip */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-yellow-400 flex items-center justify-center">
                  <span className="font-bold text-green-900 text-sm" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    COPA 2026
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-6xl mb-3">⚽</div>
                  <p
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    GRUPO
                  </p>
                  <p
                    className="text-yellow-400 text-3xl font-bold"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    PRESENÇA
                  </p>
                </div>
                <div className="absolute bottom-4 flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-4 h-5 bg-yellow-400/50 rounded-sm" />
                  ))}
                </div>
              </div>
            </motion.div>

            {!disabled && (
              <motion.button
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-2xl px-12 py-4 rounded-2xl shadow-xl"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                onClick={handleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ABRIR PACOTE!
              </motion.button>
            )}
          </motion.div>
        )}

        {state === "opening" && (
          <motion.div
            key="opening"
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              ✨
            </motion.div>
            <p
              className="text-green-900 text-2xl font-bold"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              ABRINDO...
            </p>
          </motion.div>
        )}

        {state === "revealed" && stickers[currentIndex] && (
          <StickerReveal
            key={currentIndex}
            sticker={stickers[currentIndex]}
            index={currentIndex}
            total={stickers.length}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
