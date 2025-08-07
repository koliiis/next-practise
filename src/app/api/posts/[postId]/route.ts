import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const id = Number(params.postId);

    const post = await prisma.post.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const formattedPost = {
      ...post,
      likesCount: post.likes.length,
      commentsCount: post._count.comments,
      likedByCurrentUser: currentUserId
        ? post.likes.some((like) => like.userId === +currentUserId)
        : false,
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
