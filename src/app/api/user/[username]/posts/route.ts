import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    const userWithPosts = await prisma.user.findUnique({
      where: { username },
      include: {
        Post: {
          orderBy: { createdAt: 'desc' },
          include: {
            User: true,
          },
        },
      },
    });

    if (!userWithPosts) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify(userWithPosts.Post), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}