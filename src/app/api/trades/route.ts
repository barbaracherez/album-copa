import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "open";

  const trades = await prisma.trade.findMany({
    where: { status: filter },
    include: {
      fromUser: true,
      toUser: true,
      offeredSticker: true,
      wantedSticker: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ trades });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { offeredStickerId, wantedStickerId, message } = await req.json();

  // Check user owns offered sticker (quantity > 1 means has extra to trade)
  const userSticker = await prisma.userSticker.findUnique({
    where: { userId_stickerId: { userId, stickerId: offeredStickerId } },
  });

  if (!userSticker || userSticker.quantity < 2) {
    return NextResponse.json(
      { error: "You need at least 2 copies to trade this sticker" },
      { status: 400 }
    );
  }

  const trade = await prisma.trade.create({
    data: {
      fromUserId: userId,
      offeredStickerId,
      wantedStickerId: wantedStickerId || null,
      message: message || null,
      status: "open",
    },
    include: {
      fromUser: true,
      offeredSticker: true,
      wantedSticker: true,
    },
  });

  return NextResponse.json({ trade });
}
