import { create } from 'zustand';
import { CommentType } from '@/shared/types/comment';

interface CommentStore {
  comments: CommentType[];
  loadComments: (postId: number) => Promise<void>;
  addComment: (postId: number, text: string, userId: number) => Promise<void>;
}

export const useComments = create<CommentStore>((set) => ({
  comments: [],

  loadComments: async (postId) => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();
    set({ comments: data });
  },

  addComment: async (postId, text, userId) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, text, userId }),
    });
    const newComment = await res.json();
    set((state) => ({ comments: [...state.comments, newComment] }));
  }

}));
