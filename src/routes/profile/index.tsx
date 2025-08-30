import { createFileRoute } from '@tanstack/react-router';
import { useUsersProfile } from '@/hooks/user/useUsersProfile';

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUsersProfile();
  return <div>{user?.email}</div>;
}
