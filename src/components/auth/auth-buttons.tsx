'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { UserNav } from './user-nav';
import { PAGES } from '@/config/pages.config';

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className='mx-8'>
        <UserNav user={session.user} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-max mx-4">
      <Button size="sm" variant="secondary" asChild>
        <Link href={PAGES.SIGNIN}>Sign In</Link>
      </Button>
      <Button size="sm" asChild className="text-white">
        <Link href={PAGES.SIGNUP}>Sign Up</Link>
      </Button>
    </div>
  );
}