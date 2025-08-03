import { DeletePost } from "@/app/server-actions/delete-post";
import { PostType } from "@/shared/types/post";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmDeletePost";

interface Props {
  post: PostType;
  currentUser: string;
  onPostDeleted: () => void;
}

export function Post({ post, currentUser, onPostDeleted }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    <div
      className="
        flex justify-between
        border border-gray-300
        rounded-lg
        my-2 py-2 px-2
        "
    >
      <div className="flex flex-col">
        <h2 className="font-bold text-lg">{post.title}</h2>
        <p className="text-gray-700 mb-1">{post.text}</p>
        <p className="text-sm text-gray-500">
          Posted by:{" "}
          <p>
            {post.User.username}
          </p>
        </p>
        <p className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      
      {+currentUser === post.userId &&
        <button
          onClick={() => setConfirmOpen(true)}
          className="h-5 w-5 cursor-pointer"
        >
          X
        </button>}
      
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