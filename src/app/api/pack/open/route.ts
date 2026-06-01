import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openPack, canOpenPack } from "@/lib/sticker-engine";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const { canOpen, nextPackAt } = await canOpenPack(userId);
  if (!canOpen) {
    return NextResponse.json({ error: "Pack not available yet", nextPackAt }, { status: 429 });
  }

  const stickers = await openPack(userId);
  return NextResponse.json({ stickers });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const status = await canOpenPack(userId);
  return NextResponse.json(status);
}
