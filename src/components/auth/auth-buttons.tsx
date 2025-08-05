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
      <div className='mx-8 cursor-pointer'>
        <UserNav user={session.user} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 w-max mx-4">
        <Button size="sm" variant="secondary" onClick={() => setModal('signin')} className='cursor-pointer'>
          Sign In
        </Button>
        <Button size="sm" onClick={() => setModal('signup')} className="text-white cursor-pointer hover:bg-neutral-800">
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
