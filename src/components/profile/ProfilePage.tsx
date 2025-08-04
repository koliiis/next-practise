'use client';

import { useEffect } from 'react';
import { useUserPosts } from '@/stores/useUserPosts';
import { Post } from '@/components/post/Post';
import { User } from '@/shared/types/user';

export default function ProfilePageClient({ user }: { user: User }) {
  const { posts, loadPosts, removePost } = useUserPosts();

  useEffect(() => {
    loadPosts(user.username);
  }, [user.username, loadPosts]);

  return (
    <section className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">@{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Posts by {user.username}:</h2>

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
