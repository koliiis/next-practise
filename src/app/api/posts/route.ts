import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { User: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "something baadd happened" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, text, userId } = body;

    if (!title || !text || !userId) {
      return NextResponse.json({ error: "Title, text, and userId are required" }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        text,
        userId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}