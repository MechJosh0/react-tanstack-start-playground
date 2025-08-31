import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { sessionService } from '@/services/session.service';

export const isAuthenticatedMiddleware = createMiddleware({ type: 'function' }).server(async ({ next, context }) => {
  const sessionToken = getCookie('session');
  let session;

  if (sessionToken) {
    session = await sessionService.extend(sessionToken);
  }

  if (!sessionToken || !session) {
    throw redirect({ to: '/auth/login' });
  }

  return next({
    context: {
      session,
    },
  });
});
