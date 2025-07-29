"use client";

import { PublishPost } from "@/app/server-actions/publish-post";
import { useFormStatus } from "react-dom";
import { useState } from "react";

export function PostForm({ onPostCreated }: { onPostCreated?: () => void }) {
  const [value, setValue] = useState("");

  async function action(formData: FormData) {
    await PublishPost(formData);
    setValue(""); // очистити поле після сабміту
    onPostCreated?.(); // оновити список
  }

  const { pending } = useFormStatus();

  return (
    <form action={action} className="space-y-2">
      <input
        name="content"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What's on your mind?"
        className="border px-4 py-2 w-full"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {pending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}