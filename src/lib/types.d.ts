import { SafeUser } from "@/path/to/authOptions"; // імпортуй, якщо треба

declare module "next-auth" {
  interface Session {
    user: SafeUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: SafeUser;
  }
}