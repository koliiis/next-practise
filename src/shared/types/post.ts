import { User } from "./user";

export interface PostType {
  id: number;
  title: string;
  text: string;
  userId: number;
  createdAt: string;
  User: User;
}