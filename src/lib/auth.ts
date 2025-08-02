import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },

  session: {
    strategy: 'jwt',
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) { // I know, it just doesn't work properly, I'm not backender :(
      if (user) {
        token.user = {
          id: +(user.id),
          username: token.user.username,
          email: token.user.email,
          phone: token.user.phone,
          image: token.user.image,
          password: token.user.password,
        };
      }
      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) throw new Error('User name or password is not correct');
        if (!credentials?.password) throw new Error('Please Provide Your Password');

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error('User name or password is not correct');

        return {
          id: String(user.id),
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],
};