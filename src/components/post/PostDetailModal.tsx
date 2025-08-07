'use client';

import { useEffect, useState } from "react";
import { PostType } from "@/shared/types/post";
import { useSession } from "next-auth/react";
import { useComments } from "@/stores/useComments";
import Link from "next/link";
import { PAGES } from "@/config/pages.config";

interface Props {
  post: PostType;
  onCommentAdded?: () => void;
}

export function PostDetailModal({ post, onCommentAdded }: Props) {
  const { data: session } = useSession();
  const { comments, loadComments, addComment } = useComments();
  const [newComment, setNewComment] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    loadComments(post.id);
  }, [post.id, loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setPending(true);
      if (post.id) await addComment(post.id, newComment, +userId);
      setNewComment('');
      if (post.id) {
        await loadComments(post.id);
        await onCommentAdded;
      }
    } catch {
      alert('Помилка при додаванні коментаря');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-neutral-400 mt-2 whitespace-pre-wrap break-all overflow-y-auto">{post.text}</p>
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Comments</h2>

        {session?.user && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <textarea
              className="flex-grow w-full p-3 rounded bg-neutral-800 text-white border border-neutral-600 resize-none"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || !newComment.trim()}
              className={`px-4 py-2 rounded font-medium transition w-25  ${newComment.trim()
                  ? "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              {pending ? "Posting..." : "Post"}
            </button>
          </form>
        )}

        {comments.length !== 0 && <div className="mt-8 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-neutral-800 p-4 rounded mt-4">
              <div className='flex items-center gap-2'>
                <Link href={PAGES.PROFILE(comment.User.username)} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                  {comment.User.username[0]?.toUpperCase()}
                </Link>
                <p className=" text-neutral-500">{comment.User.username}</p>
              </div>
              <p className="text-sm mt-4 text-neutral-300">{comment.text}</p>
            </div>
          ))}
        </div>
        }
      </section>
    </div>
  );
}
