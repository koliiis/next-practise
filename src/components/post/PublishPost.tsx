'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostForm } from './PostForm';
import { useAllPosts } from '@/stores/useAllPosts';
import { useUserPosts } from '@/stores/useUserPosts';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { setTrigger: triggerAll } = useAllPosts();
  const { setTrigger: triggerUser } = useUserPosts();  
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-xl bg-neutral-800 border border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle>Add new post</DialogTitle>
        </DialogHeader>

        <PostForm onPostCreated={() => {
          onOpenChange(false);
          triggerAll();
          triggerUser();
         }} />
      </DialogContent>
    </Dialog>
  );
}
