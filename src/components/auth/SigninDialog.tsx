'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SignInForm } from './signin-form';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

export function SigninDialog({ open, onOpenChange, onSwitchToSignup }: CreatePostModalProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-xl bg-neutral-800 border border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>

        <SignInForm onOpenChange={onOpenChange} onSwitchToSignup={onSwitchToSignup} />
      </DialogContent>
    </Dialog>
  );
}
