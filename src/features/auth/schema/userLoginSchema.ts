import { emailSchema, passwordSchema } from '@/lib/validation/account.schema';
import z from 'zod';

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
