'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/shared/types/user';

interface Props {
  user: User;
}

export function UserNav({ user }: Props) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center h-full">
          <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/img/avatars/01.png" alt="avatar image" />
              <AvatarFallback className="text-neutral-700 text-xl hover:text-violet-700">
                {session?.user?.username?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-neutral-800 text-white border border-neutral-700"
        side="right"
        align="end"
        sideOffset={32}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-neutral-700" />

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
