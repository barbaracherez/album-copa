"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Send } from "lucide-react";

interface CreatePostProps {
  onPost: (content: string) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    await onPost(content.trim());
    setContent("");
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold flex-shrink-0">
          {session?.user?.name?.[0] || "U"}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compartilhe uma conquista, troca ou momento do álbum..."
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-green-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <motion.button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Send className="w-4 h-4" />
              Publicar
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
