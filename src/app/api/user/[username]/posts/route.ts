import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;

    const userWithPosts = await prisma.user.findUnique({
      where: { username },
      include: {
        Post: {
          orderBy: { createdAt: 'desc' },
          include: {
            User: true,
            likes: {
              select: { userId: true },
            },
            _count: {
              select: { comments: true },
            },
          },
        },
      },
    });

    if (!userWithPosts) {
      return new Response('User not found', { status: 404 });
    }

    const enrichedPosts = userWithPosts.Post.map((post) => ({
      ...post,
      likesCount: post.likes.length,
      commentsCount: post._count.comments,
      likedByCurrentUser: post.likes.some(like => like.userId === +sessionUserId),
    }));

    return new Response(JSON.stringify(enrichedPosts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
