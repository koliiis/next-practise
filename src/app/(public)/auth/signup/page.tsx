'use client';

import { SignUpForm } from "@/components/auth/signup-form";
import { PAGES } from "@/config/pages.config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-4">
      <SignUpForm />
      <Link
        href={PAGES.HOME}
        className="bg-blue-500 text-white px-3 py-1 block w-50 mt-10 rounded hover:bg-blue-600"
      >
        Back to home page
      </Link>
    </div>
  );
}
