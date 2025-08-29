import { createServerFn } from '@tanstack/react-start';
import { userService } from '@/services/user.service';

export const userLogout = createServerFn({ method: 'POST' }).handler(
  async () => {
    await userService.logout();

    return true;
  },
);
