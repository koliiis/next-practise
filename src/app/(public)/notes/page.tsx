'use client';

import { Post } from "@/components/Post/Post";
import { PAGES } from "@/config/pages.config";
import { PostType } from "@/shared/types/post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Notes() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
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

  return <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Notes</h1>
    <div className="w-100">
      {posts.length === 0 && <div>No posts</div>}
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
        />
      ))}
    </div>
    <Link href={PAGES.HOME} className="bg-blue-500 text-white px-3 py-1 block w-50 mt-10 rounded hover:bg-blue-600">
      Back to home page
    </Link>
  </div>
}


// <ul className="space-y-2">
//   {posts.map(note => (
//     <li key={note.id} className="flex justify-between items-center border p-3 rounded">
//       <span>{note.title}</span>
//       <Link href={PAGES.NOTE(note.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
//         View
//       </Link>
//     </li>
//   ))}
// </ul>