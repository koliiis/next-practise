"use server";

import { prisma } from "@/lib/prisma";

export async function PublishPost(formData: FormData) {
  const content = formData.get("content") as string;

  const userId = 1;

  if (!content) return;

  await prisma.post.create({
    data: {
      title: "Default title",
      text: content,
      userId,
    },
  });
}