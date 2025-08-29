import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { sessionRepo } from '@/repositories/session.repository';

export const userGet = createServerFn({ method: 'GET' }).handler(async () => {
  const sessionToken = getCookie('session');

  if (!sessionToken) return null;

  const session = await sessionRepo.getByToken(sessionToken);

  if (!session) return null;

  // TODO Move into middleware
  await sessionRepo.update(session.id);

  return { id: session.user.id, email: session.user.email };
});
