import z from 'zod';
import { emailSchema, passwordSchema } from '@/lib/validation/account.schema';

export const userCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
