'use client';

import { Post } from "@/components/post/Post";
import { PAGES } from "@/config/pages.config";
import { PostType } from "@/shared/types/post";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [posts, setPosts] = useState<PostType[]>([]);

  const loadPosts = useCallback(() => {
    fetch("/api/posts")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setPosts(data.slice(0, 3)))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <main className="max-w-3xl mx-auto mt-12">
      <h1 className="text-4xl font-bold text-center mb-6">Hey, welcome 👋</h1>
      <p className="text-center text-gray-600 mb-8">Explore thoughts, tutorials, and personal notes.</p>

      <div className="text-center mb-8">
          <Link
            href={PAGES.NOTES}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            View All Posts
          </Link>
        </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} currentUser={currentUserId} onPostDeleted={loadPosts} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
