import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
      likes: true,
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { content, type, metadata } = await req.json();

  const post = await prisma.post.create({
    data: {
      userId,
      content,
      type: type || "general",
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
    include: { user: true, comments: true, likes: true, _count: { select: { comments: true, likes: true } } },
  });

  return NextResponse.json({ post });
}
