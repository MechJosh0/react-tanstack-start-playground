import { createFileRoute } from '@tanstack/react-router';
import { useUsersProfile } from '@/hooks/user/useUsersProfile';

export const Route = createFileRoute('/_profile/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUsersProfile();

  if (!user) {
    return <></>;
  }

  return <div>--{user.email}</div>;
}
