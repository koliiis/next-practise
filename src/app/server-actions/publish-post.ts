"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PublishPost(formData: FormData) {
  const content = formData.get("content") as string;
  const title = formData.get("title") as string;
  
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!content) return;
  if (!userId) {
    return;
  }

  await prisma.post.create({
    data: {
      title: title,
      text: content,
      userId: +userId,
    },
  });
}