import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const postId = params.id;

  const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });

  if (existing) {
    await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({ data: { postId, userId } });
  return NextResponse.json({ liked: true });
}
