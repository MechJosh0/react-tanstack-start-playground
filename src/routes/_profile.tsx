import { Outlet, createFileRoute } from '@tanstack/react-router';
import { requireAuth } from '@/utils/auth';
import { useUsersProfile } from '@/hooks/user/useUsersProfile';

export const Route = createFileRoute('/_profile')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const auth = await requireAuth(location.pathname);

    return { auth };
  },
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  if (!auth.isLoggedIn) {
    return <></>;
  }

  return (
    <div>
      The layout! --
      <Outlet />
    </div>
  );
}
