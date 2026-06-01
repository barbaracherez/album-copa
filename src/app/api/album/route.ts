import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const [allStickers, userStickers] = await Promise.all([
    prisma.sticker.findMany({ orderBy: { number: "asc" } }),
    prisma.userSticker.findMany({
      where: { userId },
      include: { sticker: true },
    }),
  ]);

  return NextResponse.json({ allStickers, userStickers });
}
