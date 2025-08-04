import { useState, useRef, useEffect } from "react";
import { PostType } from "@/shared/types/post";
import { DeletePost } from "@/app/server-actions/delete-post";
import { ConfirmModal } from "./ConfirmDeletePost";
import { formatDistanceToNow } from "date-fns";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { PAGES } from "@/config/pages.config";

interface Props {
  post: PostType;
  currentUser: string;
  onPostDeleted: () => void;
}

export function Post({ post, currentUser, onPostDeleted }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="mt-2 group relative bg-neutral-800 text-white rounded-xl p-4 max-w-2xl mx-auto border border-neutral-700 hover:bg-neutral-700 transition">
      <div className="flex items-start gap-3">
        <Link href={PAGES.PROFILE(post.User.username)} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
          {post.User.username[0]?.toUpperCase()}
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={PAGES.PROFILE(post.User.username)} className="font-semibold">{post.User.username}</Link>
            <span className="text-sm text-neutral-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          {post.title && (
            <h2 className="mt-2 font-bold text-lg">{post.title}</h2>
          )}

          <p className="mt-1 text-neutral-400 whitespace-pre-line text-sm">{post.text}</p>
        </div>

        {+currentUser === post.userId && (
          <div className="relative transition-opacity duration-500" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-gray-200"
            >
              <HiOutlineDotsHorizontal size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded shadow-md z-10">
                <button
                  onClick={() => {
                    setConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-neutral-800 hover:text-black bg-neutral-100 hover:bg-neutral-300 cursor-pointer rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmOpen && (
        <ConfirmModal
          message="Are you sure you want to delete this post?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
