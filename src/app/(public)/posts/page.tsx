"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAllPosts } from "@/stores/useAllPosts";
import { Post } from "@/components/post/Post";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostSkeleton } from "@/components/post/PostSkeleton";

export default function Posts() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const { allPosts, loadPosts, trigger } = useAllPosts();

  const [searchType, setSearchType] = useState("posts");
  const [query, setQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadPosts().finally(() => setIsLoading(false));
  }, [loadPosts, trigger]);

  const filteredPosts = allPosts.filter(post =>
    post.title?.toLowerCase().includes(query.toLowerCase()) ||
    post.text.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPostsByAuthor = allPosts.filter(post =>
    post.User.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-neutral-900 p-4 rounded-2xl">
      <h1 className="text-2xl font-bold m-6 text-white">All Posts</h1>

      <div className="flex gap-4 mb-6 relative mx-auto max-w-3xl">
        <Input
          placeholder={`Search ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xl focus:bg-neutral-800 focus:border-none cursor-text text-white border-2 border-neutral-700"
        />

        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-34 border-2 border-neutral-700 text-neutral-500 hover:bg-neutral-800 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 text-neutral-500 border-2 border-neutral-700">
            <SelectItem value="posts" className="data-[highlighted]:bg-neutral-800 data-[highlighted]:text-white data-[state=checked]:bg-neutral-700 data-[state=checked]:text-white cursor-pointer">Posts</SelectItem>
            <SelectItem value="users" className="data-[highlighted]:bg-neutral-800 data-[highlighted]:text-white data-[state=checked]:bg-neutral-700 data-[state=checked]:text-white cursor-pointer">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-200">
        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {!isLoading && searchType === "posts" && filteredPosts.length === 0 && (
          <div className="text-neutral-500">No posts found</div>
        )}

        {!isLoading && searchType === "posts" &&
          filteredPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUserId}
              onPostDeleted={loadPosts}
            />
          ))}

        {!isLoading && searchType === "users" && filteredPostsByAuthor.length === 0 && (
          <div className="text-neutral-500">No posts found</div>
        )}

        {!isLoading && searchType === "users" &&
          filteredPostsByAuthor.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUserId}
              onPostDeleted={loadPosts}
            />
          ))}
      </div>
    </div>
  );
}
