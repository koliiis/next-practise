import { PostType } from "./post";

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone?: number | null;
  image?: string | null;
  Post?: PostType[];
}