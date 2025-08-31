import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { userService } from '@/services/user.service';
import { sessionService } from '@/services/session.service';

export const userGet = createServerFn({ method: 'GET' }).handler(async () => {
  // TODO move this into a middleware
  const sessionToken = getCookie('session');
  if (!sessionToken) throw new Error('Invalid session');

  const session = await sessionService.extend(sessionToken);
  if (!session) throw new Error('Invalid session');

  const user = await userService.profile(session.userId);

  console.log('return user', user);
  return user;
});
