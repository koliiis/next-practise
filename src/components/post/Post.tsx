import { useState } from "react";
import { PostType } from "@/shared/types/post";
import { DeletePost } from "@/app/server-actions/delete-post";
import { ConfirmModal } from "./ConfirmDeletePost";
import { formatDistanceToNow } from "date-fns";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface Props {
  post: PostType;
  currentUser: string;
  onPostDeleted: () => void;
}

export function Post({ post, currentUser, onPostDeleted }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="mt-2 group relative bg-neutral-100 text-black rounded-xl p-4 max-w-2xl mx-auto border border-neutral-300 hover:bg-neutral-200 transition">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
          {post.User.username[0]?.toUpperCase()}
        </div>

        {/* Name and Time */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{post.User.username}</p>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Title */}
          {post.title && (
            <h2 className="mt-2 font-bold text-lg text-black">{post.title}</h2>
          )}

          {/* Text */}
          <p className="mt-1 text-gray-800 whitespace-pre-line text-sm">{post.text}</p>
        </div>

        {/* Three dots menu */}
        {+currentUser === post.userId && (
          <div className="relative transition-opacity duration-500">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HiOutlineDotsHorizontal size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-md z-10">
                <button
                  onClick={() => {
                    setConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
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
