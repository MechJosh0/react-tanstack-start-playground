import { createServerFn } from '@tanstack/react-start';
import { userRepo } from '@/repositories/user.repository';
import z from 'zod';
import { emailSchema } from '@/lib/validation/account.schema';

export const userValidateEmailIsUnique = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      email: emailSchema,
    }),
  )
  .handler(async ({ data }) => {
    const user = await userRepo.getByEmail(data.email);

    return !user;
  });
