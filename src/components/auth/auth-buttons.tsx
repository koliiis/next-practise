'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SigninDialog } from './SigninDialog';
import { SignupDialog } from './SignupDialog';
import { useSession } from 'next-auth/react';
import { UserNav } from './user-nav';

export default function AuthButtons() {
  const { data: session } = useSession();
  const [modal, setModal] = useState<'signin' | 'signup' | null>(null);

  if (session?.user) {
    return (
      <div className='m-0 lg:mx-8 cursor-pointer'>
        <UserNav user={session.user} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row lg:flex-col justify-center items-center gap-2 lg:w-max w-6 sm:w-12 mx-2">
        <Button size="sm" variant="secondary" onClick={() => setModal('signin')} className='cursor-pointer px-1 py-6 text-xs sm:text-sm lg:py-0 sm:px-[14px]'>
          Sign In
        </Button>
        <Button size="sm" onClick={() => setModal('signup')} className="hidden lg:flex text-white cursor-pointer hover:bg-neutral-800">
          Sign Up
        </Button>
      </div>

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
    </>
  );
}
