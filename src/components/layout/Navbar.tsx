"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { BookOpen, Package, MessageSquare, ArrowLeftRight, Trophy, LogOut, Settings } from "lucide-react";

const navItems = [
  { href: "/album", label: "Álbum", icon: BookOpen },
  { href: "/pack", label: "Pacote", icon: Package },
  { href: "/feed", label: "Feed", icon: MessageSquare },
  { href: "/trocas", label: "Trocas", icon: ArrowLeftRight },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-green-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/album" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-green-900" />
          </div>
          <span
            className="text-xl font-bold text-yellow-400 hidden sm:block"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            ÁLBUM COPA 2026
          </span>
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}>
                <motion.div
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-yellow-400 text-green-900"
                      : "text-white/80 hover:bg-green-800 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* User menu */}
        <div className="flex items-center gap-2">
          {(session?.user as any)?.role === "admin" && (
            <Link href="/admin">
              <motion.div
                className="p-2 rounded-lg text-white/80 hover:bg-green-800 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-4 h-4" />
              </motion.div>
            </Link>
          )}
          <div className="flex items-center gap-2">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || ""}
                className="w-8 h-8 rounded-full border-2 border-yellow-400"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-green-900 font-bold text-sm">
                {session?.user?.name?.[0] || "U"}
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-green-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
