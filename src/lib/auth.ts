import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type SafeUser = {
  id: string;
  username: string;
  email: string;
  phone: number | null;
  image: string | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<SafeUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        // 🔧 Повертаємо об'єкт SafeUser
        const safeUser: SafeUser = {
          id: String(user.id),
          username: user.username,
          email: user.email,
          phone: user.phone,
          image: user.image,
        };

        return safeUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as SafeUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as SafeUser;
      }
      return session;
    },
  },
};
