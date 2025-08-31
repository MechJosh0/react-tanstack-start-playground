import { createServerFn } from '@tanstack/react-start';
import { userService } from '@/services/user.service';
import { isAuthenticatedMiddleware } from '@/middleware/isAuthenticated';

export const userGet = createServerFn({ method: 'GET' })
  .middleware([isAuthenticatedMiddleware])
  .handler(async ({ context }) => {
    const user = await userService.profile(context.session.userId);

    return user;
  });
