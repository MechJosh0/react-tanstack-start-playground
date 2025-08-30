import z from 'zod';
import { emailSchema, passwordSchema } from '@/lib/validation/account.schema';

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;
