'use client';

import { PAGES } from "@/config/pages.config";
import Link from "next/link";

interface Note {
  id: number;
  title: string;
}

const testNotes: Note[] = [
  { id: 1, title: 'Buy groceries' },
  { id: 2, title: 'Read Next.js docs' },
  { id: 3, title: 'Write blog post' },
];

export default function Notes() {
  return <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Notes</h1>
    <ul className="space-y-2">
      {testNotes.map(note => (
        <li key={note.id} className="flex justify-between items-center border p-3 rounded">
          <span>{note.title}</span>
          <Link href={PAGES.NOTE(note.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            View
          </Link>
        </li>
      ))}
    </ul>
    <Link href={PAGES.HOME} className="bg-blue-500 text-white px-3 py-1 block w-50 mt-10 rounded hover:bg-blue-600">
      Back to home page
    </Link>
  </div>
}
