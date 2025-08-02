'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import type { User } from '@prisma/client';

export async function registerUser(
  user: Omit<User, 'id' | 'phone' | 'emailVerified' | 'image'>
) {
  try {
    const result = await prisma.user.create({
      data: {
        ...user,
        password: await bcrypt.hash(user.password, 10),
      },
    });
    return result;
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: 'Email already exists.' };
      }
    }
    return { error: 'An unexpected error occurred.' };
  }
}