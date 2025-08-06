import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: { postId: string } };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(params.postId) },
      include: { User: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const { text, userId } = body;

    if (!text || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        postId: Number(params.postId),
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
