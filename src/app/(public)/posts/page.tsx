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
    <div className="">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <div className="w-200">
        {allPosts.length === 0 && <div>No posts</div>}
        {allPosts.map((post) => (
          <Post key={post.id} post={post} currentUser={currentUserId} onPostDeleted={loadPosts} />
        ))}
      </div>
    </div>
  );
}
