"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-green-900" />
        </div>

        <h1
          className="text-4xl font-bold text-green-900 mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          ÁLBUM COPA 2026
        </h1>
        <p className="text-gray-500 mb-8">Grupo Presença</p>

        <button
          onClick={() => signIn("azure-ad", { callbackUrl: "/album" })}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 23 23" fill="none">
            <rect x="1" y="1" width="10" height="10" fill="#F35325" />
            <rect x="12" y="1" width="10" height="10" fill="#81BC06" />
            <rect x="1" y="12" width="10" height="10" fill="#05A6F0" />
            <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
          </svg>
          Entrar com Microsoft 365
        </button>

        <p className="text-gray-400 text-sm mt-4">
          Use sua conta corporativa @grupopresenca.com.br
        </p>
      </motion.div>
    </div>
  );
}
