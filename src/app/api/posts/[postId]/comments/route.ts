import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { postId: string } }
) {
  try {
    const postId = Number(context.params.postId);

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { User: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { postId: string } }
) {
  try {
    const postId = Number(context.params.postId);
    const body = await req.json();
    const { text, userId } = body;

    if (!text || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        postId,
      },
      include: {
        User: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
