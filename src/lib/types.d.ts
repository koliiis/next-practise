import { SafeUser } from "@/path/to/authOptions";

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