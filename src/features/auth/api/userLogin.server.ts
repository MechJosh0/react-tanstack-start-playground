import { createServerFn } from '@tanstack/react-start';
import { userCreateSchema } from '../schema/userCreateSchema';
import { userService } from '@/services/user.service';

export const userLogin = createServerFn({ method: 'POST' })
  .validator(userCreateSchema)
  .handler(async ({ data }) => {
    await userService.login(data);

    return true;
  });
