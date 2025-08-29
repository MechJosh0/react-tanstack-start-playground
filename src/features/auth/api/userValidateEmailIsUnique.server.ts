import { createServerFn } from '@tanstack/react-start';
import { userValidateEmailSchema } from '../schema/userValidateEmailSchema';
import { userService } from '@/services/user.service';

export const userValidateEmailIsUnique = createServerFn({ method: 'GET' })
  .validator(userValidateEmailSchema)
  .handler(async ({ data: email }) => {
    await userService.emailIsUnique(email);

    return true;
  });
