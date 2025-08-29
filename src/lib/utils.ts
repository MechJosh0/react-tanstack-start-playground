import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export const cn = function (...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
};

export const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

export function makeAsyncValidator<T>(fn: (value: T) => Promise<unknown>) {
  return async ({ value }: { value: T }) => {
    await fn(value);

    return null;
  };
}
