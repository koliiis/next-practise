import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userWithPosts.Post);
  } catch (error) {
    console.error('Failed to load posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}