"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function PublishPost(formData: FormData) {
  const content = formData.get("content") as string;
  
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!content) return;
  if (!userId) {
    return;
  }

  await prisma.post.create({
    data: {
      title: "Default title",
      text: content,
      userId: +userId,
    },
  });
}