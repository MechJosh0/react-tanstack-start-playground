import type z from 'zod';
import { emailSchema } from '@/lib/validation/account.schema';

export const userValidateEmailSchema = emailSchema;

export type UserValidateEmailInput = z.infer<typeof userValidateEmailSchema>;
