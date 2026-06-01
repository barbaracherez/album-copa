"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-400 opacity-10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-orange-500 opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-yellow-300 opacity-5 blur-3xl" />
      </div>

      {/* Floating balls decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-full border-2 border-yellow-400 opacity-20"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center px-4 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo/Badge */}
        <motion.div
          className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Trophy className="w-12 h-12 text-green-900" />
        </motion.div>

        {/* Title */}
        <h1
          className="text-6xl md:text-8xl font-bold text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ÁLBUM
        </h1>
        <h2
          className="text-4xl md:text-6xl font-bold text-yellow-400 mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          COPA 2026
        </h2>
        <p
          className="text-2xl md:text-3xl text-green-300 mb-8"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          GRUPO PRESENÇA
        </p>

        <p className="text-white/80 text-lg mb-10 leading-relaxed">
          Colecione figurinhas, complete o álbum, troque com colegas<br />
          e celebre a Copa do Mundo 2026!
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Star, label: "100 Figurinhas" },
            { icon: Zap, label: "Abre 1 pacote/dia" },
            { icon: Users, label: "Troque com colegas" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
              <Icon className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Login button */}
        <motion.button
          onClick={() => signIn("azure-ad", { callbackUrl: "/album" })}
          className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-xl px-12 py-4 rounded-2xl shadow-2xl transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ENTRAR COM MICROSOFT 365
        </motion.button>

        <p className="text-white/50 text-sm mt-4">
          Use sua conta @grupopresenca.com.br
        </p>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400" />
    </div>
  );
}
