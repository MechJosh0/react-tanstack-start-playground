// src/lib/server/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const logServerError = (err: unknown) => {
  // Replace with your logger
  console.error('[ServerError]', err);
};

export const toSafeMessage = (err: unknown) => {
  if (err instanceof AppError) return err.message;
  // Optionally special-case ZodError here with a generic message:
  // if (err instanceof ZodError) return 'Invalid input';
  return 'Internal server error';
};
