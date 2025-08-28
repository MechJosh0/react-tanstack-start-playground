import { z } from 'zod';

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter at least 2 characters.')
  .max(50, 'Please enter at most 50 characters.');

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter at least 2 characters.')
  .max(50, 'Please enter at most 50 characters.');

export const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid e-mail address.');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Add at least one capital letter.')
  .regex(/[0-9]/, 'Add at least one number.');
