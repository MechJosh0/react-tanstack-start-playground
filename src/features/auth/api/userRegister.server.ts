import { createServerFn } from '@tanstack/react-start';
import { userCreateSchema } from '../schema/userCreateSchema';
import { userService } from '@/services/user.service';

export const userRegister = createServerFn({ method: 'POST' })
  .validator(userCreateSchema)
  .handler(async ({ data }) => {
    await userService.register(data);

    return true;
  });
