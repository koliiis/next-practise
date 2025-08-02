'use client';

import { toast as sonnerToast } from 'sonner';

export function useToast() {
  function toast(options: Parameters<typeof sonnerToast>[0]) {
    sonnerToast(options);
  }

  return { toast };
}