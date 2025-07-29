'use client';

import { PAGES } from "@/config/pages.config";
import Link from "next/link";
import { use } from "react";

const testNotes = [
  { id: 1, title: 'Buy groceries' },
  { id: 2, title: 'Read Next.js docs' },
  { id: 3, title: 'Write blog post' },
];

export default function Notes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const noteId = Number(id);
  const note = testNotes.find(n => n.id === noteId);

  return <div className="p-4">
    {note &&
      <>
        <h1 className="text-2xl font-bold mb-4">Note #{note.id}</h1>
        <p className="text-lg">{note.title}</p>
        <Link href={PAGES.NOTES} className="bg-blue-500 text-white px-3 py-1 block w-50 mt-10 rounded hover:bg-blue-600">
          Back
        </Link>
      </>
    }
  </div>
}
