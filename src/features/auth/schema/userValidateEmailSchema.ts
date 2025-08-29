import { emailSchema } from '@/lib/validation/account.schema';
import z from 'zod';

export const userValidateEmailSchema = emailSchema;

export type UserValidateEmailInput = z.infer<typeof userValidateEmailSchema>;
