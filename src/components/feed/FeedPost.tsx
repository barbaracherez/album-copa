"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Trophy, ArrowLeftRight, Star } from "lucide-react";
import { Post } from "@/types";
import { useSession } from "next-auth/react";

interface FeedPostProps {
  post: Post;
  onUpdate: () => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  general: null,
  completed_page: <Trophy className="w-4 h-4 text-yellow-500" />,
  trade: <ArrowLeftRight className="w-4 h-4 text-blue-500" />,
  milestone: <Star className="w-4 h-4 text-orange-500" />,
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "agora mesmo";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export default function FeedPost({ post, onUpdate, onLike, onComment }: FeedPostProps) {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const userId = (session?.user as any)?.id;
  const liked = post.likes?.some((l) => l.userId === userId);

  const handleLike = async () => {
    await fetch(`/api/feed/${post.id}/like`, { method: "POST" });
    onUpdate();
    onLike?.(post.id);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    await fetch(`/api/feed/${post.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText.trim() }),
    });
    setCommentText("");
    onUpdate();
    onComment?.(post.id, commentText.trim());
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Post header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold flex-shrink-0">
          {post.user?.name?.[0] || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900">{post.user?.name || "Usuário"}</span>
            {TYPE_ICONS[post.type] && (
              <span className="flex items-center gap-1">{TYPE_ICONS[post.type]}</span>
            )}
            <span className="text-gray-400 text-sm">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="text-gray-700 mt-1 leading-relaxed">{post.content}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-3 flex items-center gap-4 border-t border-gray-100 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          <span>{post._count?.likes || post.likes?.length || 0}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post._count?.comments || post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="flex gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                {comment.user?.name?.[0] || "U"}
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                <span className="font-semibold text-sm text-gray-800">{comment.user?.name}</span>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                placeholder="Escreva um comentário..."
                className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={handleComment}
                className="bg-green-700 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
