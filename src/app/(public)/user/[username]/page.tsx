import ProfilePageClient from '@/components/profile/ProfilePage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return notFound();

  return <ProfilePageClient user={user} />;
}
