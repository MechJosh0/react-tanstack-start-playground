import { createServerFn } from '@tanstack/react-start';
import { setHeader, getCookie } from '@tanstack/react-start/server';
import { sessionRepo } from '@/repositories/session.repository';

export const userLogout = createServerFn({ method: 'POST' }).handler(
  async () => {
    const sessionToken = getCookie('session');

    if (!sessionToken) return null;

    await sessionRepo.delete(sessionToken);

    setHeader(
      'Set-Cookie',
      `session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    );

    return true;
  },
);
