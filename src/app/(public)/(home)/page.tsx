'use client';

import { PAGES } from "@/config/pages.config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1>Hello, Next 15!</h1>
      <Link href={PAGES.NOTES} className="bg-blue-500 text-white px-3 py-1 block w-50 mt-10 rounded hover:bg-blue-600">
        Lets see notes
      </Link>
    </div>
  );
}
