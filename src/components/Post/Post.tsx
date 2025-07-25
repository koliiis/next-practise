
import { PostType } from "@/shared/types/post";

interface Props {
  post: PostType;
}

export function Post({ post }: Props) {

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
      <button
        onClick={() => { }}
        className="h-5 w-5"
      >
        X
      </button>
    </div>
  );
}