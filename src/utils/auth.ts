import { redirect } from '@tanstack/react-router';
import { cookieExists } from '@/features/auth/api/cookieExists';

export const getAuthState = async () => {
  const isServer = typeof window === 'undefined';
  let isLoggedIn;

  if (isServer) {
    isLoggedIn = !!(await cookieExists());
  } else {
    isLoggedIn = document.cookie.includes('auth=true');
  }

  return { isLoggedIn };
};

export async function requireAuth(currentPath: undefined | string) {
  const auth = await getAuthState();

  if (!auth.isLoggedIn) {
    throw redirect({
      to: '/auth/login',
      search: { redirect: currentPath },
    });
  }

  return auth;
}
