"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import dynamic from "next/dynamic";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

interface PageCompleteModalProps {
  isOpen: boolean;
  sectionLabel: string;
  sectionName?: string;
  onClose: () => void;
}

export default function PageCompleteModal({ isOpen, sectionLabel, sectionName, onClose }: PageCompleteModalProps) {
  const label = sectionLabel || sectionName || "";
  return (
    <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center">
        <ReactConfetti
          width={typeof window !== "undefined" ? window.innerWidth : 1200}
          height={typeof window !== "undefined" ? window.innerHeight : 800}
          recycle={false}
          numberOfPieces={300}
          colors={["#006633", "#FFD700", "#FF6B00", "#FF1493", "#FFB800"]}
        />
        <motion.div
          className="fixed inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />
        <motion.div
          className="relative bg-white rounded-3xl p-10 max-w-md text-center shadow-2xl z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>

          <motion.div
            className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: 3 }}
          >
            <Trophy className="w-12 h-12 text-green-900" />
          </motion.div>

          <h2
            className="text-5xl font-bold text-green-900 mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            PÁGINA COMPLETA!
          </h2>
          <p className="text-2xl text-orange-500 font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {label}
          </p>
          <p className="text-gray-600 mb-8">
            Parabéns! Você completou mais uma seção do álbum Copa 2026!
          </p>

          <motion.button
            onClick={onClose}
            className="bg-green-700 text-white font-bold px-10 py-4 rounded-xl text-xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            CONTINUAR
          </motion.button>
        </motion.div>
      </div>}
    </AnimatePresence>
  );
}
