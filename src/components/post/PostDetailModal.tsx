'use client';

import { useEffect, useState } from "react";
import { PostType } from "@/shared/types/post";
import { useSession } from "next-auth/react";
import { useComments } from "@/stores/useComments";

interface Props {
  post: PostType;
  onCommentAdded?: () => void;
}

export function PostDetailModal({ post, onCommentAdded }: Props) {
  const { data: session } = useSession();
  const { comments, loadComments, addComment } = useComments();
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadComments(post.id);
  }, [post.id, loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(post.id, newComment, +session?.user.id);
      setNewComment("");

      onCommentAdded?.();
    } catch {
      alert("Помилка при додаванні коментаря");
    }
  }

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-neutral-400 mt-2 whitespace-pre-wrap">{post.text}</p>
      </div>

      <section className="border-t border-neutral-700 pt-4">
        <h3 className="text-lg font-semibold mb-2">Коментарі</h3>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-neutral-800 p-3 rounded">
              <p className="text-sm text-neutral-300">{comment.text}</p>
              <span className="text-xs text-neutral-500">— {comment.User.username}</span>
            </div>
          ))}
        </div>

        {session?.user && (
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-600"
              rows={3}
              placeholder="Напишіть коментар..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-700 transition text-sm"
            >
              Надіслати
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
