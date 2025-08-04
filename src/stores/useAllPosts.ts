// src/store/usePostStore.ts
import { create } from 'zustand';
import { PostType } from '@/shared/types/post';

interface PostStore {
  allPosts: PostType[];
  setPosts: (posts: PostType[]) => void;
  loadPosts: () => Promise<void>;
  trigger: number;
  setTrigger: () => void;
}

export const useAllPosts = create<PostStore>((set) => ({
  allPosts: [],
  trigger: 0,
  setPosts: (posts) => set({ allPosts: posts }),
  loadPosts: async () => {
    try {
      const res = await fetch("/api/posts");
      const data = res.ok ? await res.json() : [];
      set({ allPosts: data });
    } catch {
      set({ allPosts: [] });
    }
  },
  setTrigger: () => set(state => ({ trigger: state.trigger + 1 })),
}));
