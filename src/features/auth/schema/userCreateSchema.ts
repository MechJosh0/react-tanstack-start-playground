import { emailSchema, passwordSchema } from '@/lib/validation/account.schema';
import z from 'zod';

export const userCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
