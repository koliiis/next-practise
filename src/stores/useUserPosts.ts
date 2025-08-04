import { PostType } from '@/shared/types/post';
import { create } from 'zustand';

interface UserPostsState {
  posts: PostType[];
  setPosts: (posts: PostType[]) => void;
  loadPosts: (username: string) => Promise<void>;
  removePost: (postId: number) => void;
}

export const useUserPosts = create<UserPostsState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  loadPosts: async (username) => {
    try {
      const res = await fetch(`/api/user/${username}/posts`);
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      set({ posts: data });
    } catch (error) {
      set({ posts: [] });
      console.error(error);
    }
  },
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
}));