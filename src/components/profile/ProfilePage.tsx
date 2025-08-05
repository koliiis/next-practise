'use client';

import { useEffect } from 'react';
import { useUserPosts } from '@/stores/useUserPosts';
import { Post } from '@/components/post/Post';
import { User } from '@/shared/types/user';
import { signOut, useSession } from 'next-auth/react';

export default function ProfilePageClient({ user }: { user: User }) {
  const { posts, loadPosts, removePost, trigger } = useUserPosts();
  const { data: session } = useSession();

  useEffect(() => {
    loadPosts(user.username);
  }, [user.username, loadPosts, trigger]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  const isOwnProfile = session?.user?.id === user.id.toString();

  return (
    <section className="mx-auto p-8 bg-neutral-900 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="w-25 h-25 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-5xl">
          {user.username[0].toUpperCase()}
        </div>

        <div className="sm:ml-4 sm:mt-0 mt-6">
          <h1 className="text-4xl font-bold text-white">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {isOwnProfile && (
          <div className="sm:ml-auto sm:m-0 mx-auto my-4">
            <button
              onClick={handleSignOut}
              className="cursor-pointer px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-white sm:mt-12">
        Posts by {isOwnProfile ? 'you' : user.username}:
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500 italic">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUser={user.id.toString()}
              onPostDeleted={() => removePost(post.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
