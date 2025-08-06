"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function toggleLike(postId: number) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: +userId,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id },
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: {
        userId: +userId,
        postId,
      },
    });
    return { liked: true };
  }
}
