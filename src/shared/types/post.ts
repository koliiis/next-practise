export interface PostType {
  id: number;
  title: string;
  text: string;
  userId: number;
  createdAt: string;
  User: {
    id: number;
    username: string;
  };
}