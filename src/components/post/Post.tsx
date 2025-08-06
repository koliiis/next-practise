'use client';

import { useState, useRef, useEffect } from "react";
import { PostType } from "@/shared/types/post";
import { DeletePost } from "@/app/server-actions/delete-post";
import { ConfirmModal } from "./ConfirmDeletePost";
import { formatDistanceToNow } from "date-fns";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { PAGES } from "@/config/pages.config";
import { useSession } from "next-auth/react";
import { toggleLike } from "@/app/server-actions/toggle-like";
import { Heart, HeartCrack, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostDetailModal } from "./PostDetailModal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Props {
  post: PostType;
  currentUser: string;
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export function Post({ post, onPostDeleted, onPostUpdated }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);

  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      await DeletePost(post.id);
      onPostDeleted();
    } catch {
      alert("Failed to delete post");
    } finally {
      setConfirmOpen(false);
    }
  }

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => prev + (newLiked ? 1 : -1));

    try {
      await toggleLike(post.id);
      onPostUpdated();
    } catch {
      setLiked(!newLiked);
      setLikesCount((prev) => prev + (newLiked ? -1 : 1));
      alert("Failed to like post");
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer mt-4 group relative bg-neutral-800 text-white rounded-xl p-4 max-w-2xl mx-auto border border-neutral-700 hover:bg-neutral-700 transition">
          <div className="flex items-start gap-3">
            <Link href={PAGES.PROFILE(post.User.username)} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
              {post.User.username[0]?.toUpperCase()}
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href={PAGES.PROFILE(post.User.username)} className="font-semibold">{post.User.username}</Link>
                <span className="text-xs sm:text-sm text-neutral-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>

              {post.title && (
                <h2 className="mt-2 font-bold text-lg">{post.title}</h2>
              )}

              <p className="mt-1 text-neutral-400 whitespace-pre-line text-sm break-all">
                {post.text}
              </p>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={(e) => { handleLike(); e.preventDefault(); }}
                  className="flex items-center gap-2 text-neutral-500 hover:text-white transition cursor-pointer"
                >
                  {liked ? <Heart color="#a600ff" /> : <HeartCrack />}
                  <p>{likesCount}</p>
                </button>

                <button
                  className="flex items-center gap-2 text-neutral-500 hover:text-white transition cursor-pointer"
                  onClick={(e) => { e.preventDefault(); setOpen(true); }}
                >
                  <MessageCircle />
                  <span>{commentsCount}</span>
                </button>
              </div>
            </div>

            {+session?.user?.id === post.userId && (
              <div className="relative transition-opacity duration-500" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-400 hover:text-gray-200 cursor-pointer"
                  aria-label="Post options"
                >
                  <HiOutlineDotsHorizontal size={20} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded shadow-md z-10 bg-neutral-900 border border-neutral-700">
                    <button
                      onClick={() => {
                        setConfirmOpen(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-neutral-800 hover:text-red-800 bg-neutral-300 hover:bg-white cursor-pointer rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <ConfirmModal
            open={confirmOpen}
            message="Are you sure you want to delete this post?"
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl p-6">
        <VisuallyHidden>
          <DialogTitle>{post.title}</DialogTitle>
        </VisuallyHidden>
        <PostDetailModal post={post} onCommentAdded={() => setCommentsCount((prev) => prev + 1)} />
      </DialogContent>
    </Dialog>
  );
}
