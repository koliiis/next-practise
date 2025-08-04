// src/store/usePostStore.ts
import { create } from 'zustand';
import { PostType } from '@/shared/types/post';

interface PostStore {
  allPosts: PostType[];
  setPosts: (posts: PostType[]) => void;
  loadPosts: () => Promise<void>;
}

export const useAllPosts = create<PostStore>((set) => ({
  allPosts: [],
  setPosts: (posts) => set({ allPosts: posts }),
  loadPosts: async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.ok ? await res.json() : [];
      set({ allPosts: data });
    } catch {
      set({ allPosts: [] });
    }
  },
}));
