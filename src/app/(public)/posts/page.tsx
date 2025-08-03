"use client";

import { Post } from "@/components/post/Post";
import { PAGES } from "@/config/pages.config";
import { PostType } from "@/shared/types/post";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { PostForm } from "../../../components/post/PostForm";
import { useSession } from "next-auth/react";

export default function Notes() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [posts, setPosts] = useState<PostType[]>([]);

  const loadPosts = useCallback(() => {
    fetch("/api/posts")
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          console.error("API error:", error);
          return [];
        }
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error("Network error:", err);
        setPosts([]);
      });
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <div className="w-200">
        <PostForm onPostCreated={loadPosts} />
        {posts.length === 0 && <div>No posts</div>}
        {posts.map((post) => (
          <Post key={post.id} post={post} currentUser={currentUserId} onPostDeleted={loadPosts} />
        ))}
      </div>
      <Link
        href={PAGES.HOME}
        className="bg-purple-600 text-white px-3 py-1 block w-50 mt-10 rounded hover:bg-purple-700"
      >
        Back to home page
      </Link>
    </div>
  );
}
