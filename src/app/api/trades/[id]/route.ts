import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { action } = await req.json(); // "accept" | "reject" | "cancel"

  const trade = await prisma.trade.findUnique({
    where: { id: params.id },
    include: { offeredSticker: true, wantedSticker: true },
  });

  if (!trade) return NextResponse.json({ error: "Trade not found" }, { status: 404 });

  if (action === "cancel") {
    if (trade.fromUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.trade.update({ where: { id: params.id }, data: { status: "cancelled" } });
    return NextResponse.json({ success: true });
  }

  if (action === "accept") {
    if (!trade.wantedStickerId) {
      return NextResponse.json({ error: "No wanted sticker specified" }, { status: 400 });
    }

    // Check acceptor owns wanted sticker
    const acceptorHas = await prisma.userSticker.findUnique({
      where: { userId_stickerId: { userId, stickerId: trade.wantedStickerId } },
    });
    if (!acceptorHas || acceptorHas.quantity < 2) {
      return NextResponse.json({ error: "You don't have an extra copy to trade" }, { status: 400 });
    }

    // Execute swap
    await prisma.$transaction([
      // Decrement offerer's offered sticker
      prisma.userSticker.update({
        where: { userId_stickerId: { userId: trade.fromUserId, stickerId: trade.offeredStickerId } },
        data: { quantity: { decrement: 1 } },
      }),
      // Give acceptor offered sticker
      prisma.userSticker.upsert({
        where: { userId_stickerId: { userId, stickerId: trade.offeredStickerId } },
        update: { quantity: { increment: 1 } },
        create: { userId, stickerId: trade.offeredStickerId, quantity: 1 },
      }),
      // Decrement acceptor's wanted sticker
      prisma.userSticker.update({
        where: { userId_stickerId: { userId, stickerId: trade.wantedStickerId } },
        data: { quantity: { decrement: 1 } },
      }),
      // Give offerer wanted sticker
      prisma.userSticker.upsert({
        where: { userId_stickerId: { userId: trade.fromUserId, stickerId: trade.wantedStickerId } },
        update: { quantity: { increment: 1 } },
        create: { userId: trade.fromUserId, stickerId: trade.wantedStickerId, quantity: 1 },
      }),
      // Mark trade as accepted
      prisma.trade.update({
        where: { id: params.id },
        data: { status: "accepted", toUserId: userId },
      }),
    ]);

    return NextResponse.json({ success: true });
  }

  if (action === "reject") {
    await prisma.trade.update({ where: { id: params.id }, data: { status: "rejected" } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
