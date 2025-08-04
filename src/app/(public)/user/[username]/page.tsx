import ProfilePageClient from '@/components/profile/ProfilePage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return notFound();

  return <ProfilePageClient user={user} />;
}
