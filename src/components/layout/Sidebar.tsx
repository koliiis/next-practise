'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Search, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { PAGES } from '@/config/pages.config';
import AuthButtons from '../auth/auth-buttons';
import { CreatePostModal } from '../post/PublishPost';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = session?.user?.username;
  const profileHref = username ? PAGES.PROFILE(username) : PAGES.SIGNIN;

  return (
    <aside className="flex flex-col items-center gap-10 py-4 px-auto h-screen bg-black text-white rounded-br-4xl rounded-tr-4xl border-r border-neutral-800 sticky top-0">
      <Link href={PAGES.HOME} className="text-3xl font-bold mt-2 mb-4">🪲</Link>

      <nav className="flex flex-col gap-6">
        <Link href={PAGES.HOME} className="group">
          <div className={`py-3 px-6 rounded-xl flex items-center justify-center transition-all 
            ${pathname === PAGES.HOME ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
            <Home className="w-6 h-6" />
          </div>
        </Link>

        <Link href={PAGES.NOTES} className="group">
          <div className={`py-3 px-6 rounded-xl flex items-center justify-center transition-all 
            ${pathname === PAGES.NOTES ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
            <Search className="w-6 h-6" />
          </div>
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer py-3 px-6 rounded-xl flex items-center justify-center transition-all bg-neutral-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <Plus className="w-6 h-6" />
        </button>

        <Link href={profileHref} className="group">
          <div className={`py-3 px-6 rounded-xl flex items-center justify-center transition-all 
            ${pathname === profileHref ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
            <User className="w-6 h-6" />
          </div>
        </Link>
      </nav>

      <div className="mt-auto w-full flex justify-center">
        <AuthButtons />
      </div>

      <CreatePostModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </aside>
  );
}
