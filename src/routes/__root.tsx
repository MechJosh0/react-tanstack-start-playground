import { HeadContent, Link, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanstackDevtools } from '@tanstack/react-devtools';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import appCss from '../styles.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { useLogout } from '@/hooks/auth/useLogout';
import { getAuthState } from '@/utils/auth';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  beforeLoad: async () => {
    const auth = await getAuthState();

    return { auth };
  },
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const logout = useLogout();
  const { auth } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-900 text-zinc-200 font-sans text-base">
        <header className="sticky top-0 z-50 h-16 bg-zinc-900 border-b border-zinc-800">
          <nav className="flex justify-end items-center h-full px-8 space-x-10">
            <Link className="hover:text-red-400 transition-colors" to="/profile">
              Profile
            </Link>
            {!auth.isLoggedIn ? (
              <>
                <Link className="hover:text-red-400 transition-colors" to="/">
                  Home
                </Link>
                <Link className="hover:text-red-400 transition-colors" to="/auth/register">
                  Register
                </Link>
                <Link className="hover:text-red-400 transition-colors" to="/auth/login">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link className="hover:text-red-400 transition-colors" to="/">
                  Home
                </Link>
                <Link className="hover:text-red-400 transition-colors" to="/profile">
                  Profile
                </Link>
                <button className="cursor-pointer hover:text-red-400 transition-colors" onClick={() => logout.mutate()} disabled={logout.isPending}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        <main className="px-6 py-8 space-y-4">
          <div>{children}</div>
        </main>

        <footer className="px-6 py-4 text-center border-t border-zinc-800">Footer...</footer>

        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-zinc-400">The page you requested could not be located.</p>
      <div className="mt-6">
        <Link to="/" className="inline-flex rounded-full bg-red-400 px-5 py-2 font-medium text-white hover:bg-red-500 transition-colors">
          Go home
        </Link>
      </div>
    </main>
  );
}
