import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { stickerId } = await req.json();

  const userSticker = await prisma.userSticker.findUnique({
    where: { userId_stickerId: { userId, stickerId } },
  });

  if (!userSticker || userSticker.quantity < 1) {
    return NextResponse.json({ error: "Sticker not owned" }, { status: 400 });
  }

  await prisma.userSticker.update({
    where: { userId_stickerId: { userId, stickerId } },
    data: { placedInAlbum: true },
  });

  return NextResponse.json({ success: true });
}
