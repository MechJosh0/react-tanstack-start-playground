import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

export const cookieExists = createServerFn({ method: 'GET' }).handler(() => {
  const sessionToken = getCookie('auth');

  return !!sessionToken;
});
