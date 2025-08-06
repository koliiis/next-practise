import { User } from "./user";

export interface CommentType {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  postId: number;
  User: User;
}