'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Search, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { PAGES } from '@/config/pages.config';
import AuthButtons from '../auth/auth-buttons';
import { CreatePostModal } from '../post/PublishPost';
import { SigninDialog } from '../auth/SigninDialog';
import { SignupDialog } from '../auth/SignupDialog';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [modal, setModal] = useState<'signin' | 'signup' | null>(null);

  const username = session?.user?.username;

  return (
    <aside className="flex flex-col items-center gap-10 py-4 px-auto h-screen bg-black text-white rounded-br-4xl rounded-tr-4xl border-r border-neutral-800 sticky top-0">
      <Link href={PAGES.HOME} className="text-4xl font-bold mt-6">🪼</Link>

      <div className="flex flex-col flex-grow justify-center">
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

        {username ? (
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="cursor-pointer py-3 px-6 rounded-xl flex items-center justify-center transition-all bg-neutral-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Plus className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={() => setModal('signin')}
            className="cursor-pointer py-3 px-6 rounded-xl flex items-center justify-center transition-all bg-neutral-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {username ? (
          <Link href={PAGES.PROFILE(username)} className="group">
            <div className={`cursor-pointer py-3 px-6 rounded-xl flex items-center justify-center transition-all 
              ${pathname === PAGES.PROFILE(username) ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
              <User className="w-6 h-6" />
            </div>
          </Link>
        ) : (
          <button
            onClick={() => setModal('signin')}
            className="cursor-pointer py-3 px-6 rounded-xl flex items-center justify-center transition-all text-zinc-400 hover:text-white hover:bg-zinc-800"
            aria-label="Sign In"
          >
            <User className="w-6 h-6" />
          </button>
        )}
        </nav>
        </div>

      <div className="mb-2 w-full flex justify-center">
        <AuthButtons />
      </div>

      <CreatePostModal open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />

      <SigninDialog
        open={modal === 'signin'}
        onOpenChange={(o) => setModal(o ? 'signin' : null)}
        onSwitchToSignup={() => setModal('signup')}
      />
      <SignupDialog
        open={modal === 'signup'}
        onOpenChange={(o) => setModal(o ? 'signup' : null)}
        onSwitchToSignin={() => setModal('signin')}
      />
    </aside>
  );
}
