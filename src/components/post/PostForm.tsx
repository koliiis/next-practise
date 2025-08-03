"use client";

import { PublishPost } from "@/app/server-actions/publish-post";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function PostForm({ onPostCreated }: { onPostCreated?: () => void }) {
  const [value, setValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const { data: session } = useSession();
  const { pending } = useFormStatus();

  async function action(formData: FormData) {
    await PublishPost(formData);
    setValue("");
    setTitleValue("");
    onPostCreated?.();
  }

  return (
    <form action={action} className="bg-neutral-100 text-black rounded-xl p-4 mb-6 border border-neutral-300">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
          {session?.user?.username?.[0]?.toUpperCase() ?? "U"}
        </div>

        <div className="flex-1 space-y-2">
          {/* Title */}
          <input
            name="title"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Додайте тему"
            className="w-full bg-transparent text-lg placeholder-gray-500 border-b border-neutral-300 focus:outline-none focus:border-purple-500 pb-1"
          />

          {/* Content */}
          <textarea
            name="content"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Що нового?"
            className="w-full bg-transparent resize-none placeholder-gray-500 border-b border-neutral-300 focus:outline-none focus:border-purple-500 text-md"
            rows={3}
          />
          
          <div className="flex justify-between items-center pt-2 mt-2">
            <p className="text-sm text-gray-400">Будь-хто може відповідати</p>
            <button
              type="submit"
              disabled={pending || !value.trim()}
              className={`px-4 py-2 rounded font-medium transition ${
                value.trim()
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              {pending ? "Публікується..." : "Опублікувати"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}