// src/lib/server/safeServer.ts
import { createServerFn } from '@tanstack/react-start';
import type { ZodTypeAny, infer as Infer } from 'zod';
import { logServerError, toSafeMessage } from './errors';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HandlerCtx<TInput> = {
  data: TInput;
  request: Request;
};

export function makeServerFn<TSchema extends ZodTypeAny, TOut>(opts: {
  method?: Method;
  schema: TSchema;
  handler: (ctx: HandlerCtx<Infer<TSchema>>) => Promise<TOut> | TOut;
}) {
  const { method = 'POST', schema, handler } = opts;

  return createServerFn({ method })
    .validator((raw) => schema.parse(raw))
    .handler(async ({ data, request }) => {
      try {
        return await handler({ data, request });
      } catch (err) {
        logServerError(err); // full detail on the server
        throw new Error(toSafeMessage(err)); // short, safe message to client
      }
    });
}
