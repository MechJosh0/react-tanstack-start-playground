import { createServerFn } from '@tanstack/react-start';
import { userRepo } from '@/repositories/user.repository';
import { userCreateSchema } from '../schema/userCreateSchema';

export const userCreate = createServerFn({ method: 'POST' })
  .validator(userCreateSchema)
  .handler(async ({ data }) => {
    const user = await userRepo.create(data.email, data.password);

    return user;
  });
