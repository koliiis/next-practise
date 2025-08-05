"use client";

import { Post } from "@/components/post/Post";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAllPosts } from "@/stores/useAllPosts";

export default function Posts() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const { allPosts, loadPosts, trigger } = useAllPosts();

  useEffect(() => {
    loadPosts();
  }, [loadPosts, trigger]);

  return (
    <div className="bg-neutral-900 p-4 rounded-2xl">
      <h1 className="text-2xl font-bold m-6 text-white">All Posts</h1>
      <div className="max-w-200">
        {allPosts.length === 0 && <div className="text-neutral-500">No posts</div>}
        {allPosts.map((post) => (
          <Post key={post.id} post={post} currentUser={currentUserId} onPostDeleted={loadPosts} />
        ))}
      </div>
    </div>
  );
}
