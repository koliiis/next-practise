'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Search, User } from 'lucide-react';
import { PAGES } from '@/config/pages.config';
import AuthButtons from '../auth/auth-buttons';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const username = session?.user?.username;
  const profileHref = username ? PAGES.PROFILE(username) : PAGES.SIGNIN;

  const navItems = [
    { href: PAGES.HOME, icon: Home },
    { href: PAGES.NOTES, icon: Search },
    { href: profileHref, icon: User },
  ];

  return (
    <aside className="flex flex-col items-center gap-10 py-4 px-auto h-screen bg-black text-white rounded-br-4xl rounded-tr-4xl border-r border-neutral-800 sticky top-0">
      <Link href={PAGES.HOME} className="text-3xl font-bold mt-2 mb-4">🪲</Link>

      <nav className="flex flex-col gap-6">
        {navItems.map(({ href, icon: Icon }, idx) => {
          const isActive = pathname === href;

          return (
            <Link key={idx} href={href} className="group">
              <div
                className={`p-3 rounded-xl flex items-center justify-center transition-all 
                ${isActive ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto w-full flex justify-center">
        <AuthButtons />
      </div>
    </aside>
  );
}
