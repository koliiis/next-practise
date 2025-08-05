'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { PublishPost } from '@/app/server-actions/publish-post';
import { PAGES } from '@/config/pages.config';
import Link from 'next/link';
import { useAllPosts } from '@/stores/useAllPosts';
import { useUserPosts } from '@/stores/useUserPosts';

export function NewPostDropdown() {
  const [value, setValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const { setTrigger: triggerAll } = useAllPosts();
  const { setTrigger: triggerUser } = useUserPosts();

  async function action(formData: FormData) {
    await PublishPost(formData);
    setValue('');
    setTitleValue('');
    setOpen(false);
    triggerAll();
    triggerUser();
  }

  if (session) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="fixed cursor-pointer bottom-6 right-10 z-50 w-20 h-16 rounded-2xl hover:scale-110 transition-transform-color duration-300 opacity-70 hover:opacity-100 bg-neutral-800 text-white flex items-center justify-center"
            aria-label="Create new post"
          >
            <Plus className="w-8 h-8" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="bg-neutral-900 text-white border border-neutral-700 p-4 w-[480px] rounded-xl"
          side="right"
          align="end"
          sideOffset={-80}
          forceMount
        >
          <form action={action} className="space-y-2">
            <div className="flex gap-3">
              <Link
                href={PAGES.PROFILE(session?.user?.username)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white"
              >
                {session?.user?.username?.[0]?.toUpperCase() ?? 'U'}
              </Link>

              <div className="flex-1 space-y-2">
                <input
                  name="title"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  placeholder="Title"
                  className="text-white w-full bg-transparent text-lg placeholder-neutral-600 border-b border-neutral-700 focus:outline-none focus:border-purple-500 focus:placeholder-neutral-500 pb-1"
                />

                <textarea
                  name="content"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="What's new?"
                  className="text-white w-full bg-transparent resize-none placeholder-neutral-600 border-b border-neutral-700 focus:outline-none focus:border-purple-500 focus:placeholder-neutral-500 text-md"
                  rows={3}
                />

                <div className="flex justify-between items-center pt-2 mt-2">
                  <p className="text-sm text-neutral-600">
                    Everyone can see and comment
                  </p>
                  <button
                    type="submit"
                    disabled={!value.trim()}
                    className={`px-4 py-2 rounded font-medium transition ${value.trim()
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
