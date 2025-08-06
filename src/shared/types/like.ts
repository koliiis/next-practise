import { PostType } from "./post";
import { User } from "./user";

export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  User: User;
  Post: PostType;
}