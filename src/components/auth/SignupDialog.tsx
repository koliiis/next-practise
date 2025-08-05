'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SignUpForm } from './signup-form';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignin: () => void;
}

export function SignupDialog({ open, onOpenChange, onSwitchToSignin }: CreatePostModalProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-neutral-800 border border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>

        <SignUpForm onOpenChange={onOpenChange} onSwitchToSignin={onSwitchToSignin} />
      </DialogContent>
    </Dialog>
  );
}
