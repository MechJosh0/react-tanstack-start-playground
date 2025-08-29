import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { userService } from '@/services/user.service';
import { sessionService } from '@/services/session.service';

export const userGet = createServerFn({ method: 'GET' }).handler(async () => {
  // TODO move this into a middleware
  const sessionToken = getCookie('session');
  if (!sessionToken) return null;
  const session = await sessionService.extend(sessionToken);
  if (!session) return null;

  const user = await userService.profile(session.userId);

  return user;
});
