'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Post } from '@/components/post/Post';
import { useAllPosts } from '@/stores/useAllPosts';
import Link from 'next/link';
import { PAGES } from '@/config/pages.config';
import { PostSkeleton } from '@/components/post/PostSkeleton';

export default function Home() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const { allPosts, loadPosts, trigger } = useAllPosts();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadPosts().finally(() => setIsLoading(false));
  }, [loadPosts, trigger]);

  const latestPosts = allPosts.slice(0, 3);

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto mt-12 px-4">
      <h1 className="text-4xl text-white font-bold text-center mb-6">
        Hey, welcome {session?.user?.username} 👋
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Explore thoughts, tutorials, and personal notes.
      </p>

      <section className='bg-neutral-900 p-5 rounded-2xl border border-neutral-800'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className="text-2xl text-white font-semibold">
            Hottest Posts
          </h2>

          <Link
            href={PAGES.POSTS}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-4 py-2 rounded"
          >
            All posts
          </Link>
        </div>

        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : latestPosts.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          <div className="space-y-6 pb-2">
            {latestPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                currentUser={currentUserId}
                onPostDeleted={loadPosts}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
