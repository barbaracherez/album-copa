"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Users, Package, Trophy } from "lucide-react";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: { userStickers: number; posts: number };
}

interface AdminSticker {
  id: string;
  number: number;
  name: string;
  section: string;
  rarity: string;
  imageUrl: string | null;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stickers, setStickers] = useState<AdminSticker[]>([]);
  const [tab, setTab] = useState<"users" | "stickers">("users");
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (userRole !== "admin") return;
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/stickers").then((r) => r.json()),
    ]).then(([u, s]) => {
      setUsers(u.users || []);
      setStickers(s.stickers || []);
      setLoading(false);
    });
  }, [userRole]);

  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-5xl mb-3">🔒</p>
          <h2 className="font-bebas text-3xl text-gray-700">Acesso Restrito</h2>
          <p className="text-gray-500">Apenas administradores podem acessar esta área.</p>
        </div>
      </div>
    );
  }

  async function toggleAdmin(userId: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role: newRole }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  }

  async function updateStickerImage(stickerId: string, imageUrl: string) {
    await fetch("/api/admin/stickers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: stickerId, imageUrl }),
    });
    setStickers((prev) => prev.map((s) => (s.id === stickerId ? { ...s, imageUrl } : s)));
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="font-bebas text-4xl text-green-800 tracking-wide">⚙️ PAINEL ADMIN</h1>
        <p className="text-gray-500 text-sm">Gerencie usuários e figurinhas do álbum</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: "Colaboradores", value: users.length, color: "#006633" },
          { icon: Package, label: "Figurinhas", value: stickers.length, color: "#FF6B00" },
          { icon: Trophy, label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "#FFB800" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color + "22" }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["users", "stickers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
              tab === t ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t === "users" ? "Usuários" : "Figurinhas"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === "users" ? (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Colaborador</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Figurinhas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Posts</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Função</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{user.name || "—"}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user._count.userStickers}</td>
                  <td className="px-4 py-3 text-gray-600">{user._count.posts}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      user.role === "admin" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role === "admin" ? "Admin" : "Colaborador"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAdmin(user.id, user.role)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {user.role === "admin" ? "Remover admin" : "Tornar admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Seção</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Raridade</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Imagem URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stickers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-500">#{s.number}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{s.section}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      s.rarity === "gold" ? "bg-yellow-100 text-yellow-800" :
                      s.rarity === "rare" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"
                    }`}>{s.rarity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      defaultValue={s.imageUrl || ""}
                      onBlur={(e) => updateStickerImage(s.id, e.target.value)}
                      placeholder="https://..."
                      className="text-xs border border-gray-200 rounded px-2 py-1 w-48 outline-none focus:border-green-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
