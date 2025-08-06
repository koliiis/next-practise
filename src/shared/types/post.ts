import { User } from "./user";

export interface PostType {
  id: number;
  title?: string;
  text: string;
  createdAt: string;
  userId: string | number;
  User: User;
  likesCount: number;
  likedByCurrentUser: boolean;
}