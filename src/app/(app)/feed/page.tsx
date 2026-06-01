"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types";
import FeedPost from "@/components/feed/FeedPost";
import CreatePost from "@/components/feed/CreatePost";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    const res = await fetch("/api/feed");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handlePost(content: string) {
    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type: "general" }),
    });
    fetchPosts();
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="font-bebas text-4xl text-green-800 tracking-wide mb-1">🏆 FEED DA COPA</h1>
        <p className="text-gray-500 text-sm">Celebre conquistas, compartilhe e interaja com o time!</p>
      </div>

      <CreatePost onPost={handlePost} />

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-5xl mb-3">⚽</p>
            <p className="font-semibold">Nenhuma publicação ainda.</p>
            <p className="text-sm">Seja o primeiro a compartilhar!</p>
          </div>
        ) : (
          posts.map((post) => (
            <FeedPost key={post.id} post={post} onUpdate={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
}
