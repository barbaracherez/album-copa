export interface Sticker {
  id: string;
  number: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  section: string;
  rarity: "normal" | "rare" | "gold";
  dropWeight: number;
}

export interface UserSticker {
  id: string;
  userId: string;
  stickerId: string;
  quantity: number;
  placedInAlbum: boolean;
  createdAt: Date;
  sticker: Sticker;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string;
  lastPackAt?: Date | null;
  createdAt: Date;
}

export interface Trade {
  id: string;
  fromUserId: string;
  toUserId?: string | null;
  offeredStickerId: string;
  wantedStickerId?: string | null;
  status: "open" | "pending" | "accepted" | "rejected" | "cancelled";
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
  fromUser: User;
  toUser?: User | null;
  offeredSticker: Sticker;
  wantedSticker?: Sticker | null;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  type: "general" | "completed_page" | "trade" | "milestone";
  metadata?: string | null;
  createdAt: Date;
  user: User;
  comments: Comment[];
  likes: Like[];
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: User;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
}

export const SECTIONS: Record<string, { label: string; color: string; emoji: string }> = {
  historia: { label: "História", color: "#006633", emoji: "📜" },
  unidades: { label: "Unidades", color: "#0066CC", emoji: "🏢" },
  diretoria: { label: "Diretoria", color: "#FFB800", emoji: "⭐" },
  areas: { label: "Áreas", color: "#FF6B00", emoji: "🏆" },
  premios: { label: "Prêmios", color: "#9B59B6", emoji: "🥇" },
  momentos: { label: "Momentos", color: "#E74C3C", emoji: "📸" },
  colaboradores: { label: "Colaboradores", color: "#27AE60", emoji: "👥" },
  brasil2026: { label: "Brasil 2026", color: "#FFD700", emoji: "🇧🇷" },
  selecao: { label: "Seleção Presença", color: "#006633", emoji: "⚽" },
};
