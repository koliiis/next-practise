import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        User: true,
        likes: {
          select: { userId: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
      commentsCount: post._count.comments,
      likedByCurrentUser: currentUserId
        ? post.likes.some((like) => like.userId === +currentUserId)
        : false,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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