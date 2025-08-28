import * as React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/react-form';
import { Input as UIInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Minimal field surface used here (keeps you decoupled from internal generics)
// type FieldLike = {
//   name: string
//   state: {
//     value: any
//     meta: {
//       touched?: boolean
//       // Matches TanStack: errors array, plus errorMap keyed by lifecycle
//       errors?: unknown[]
//       errorMap?: Record<string, unknown | undefined>
//     }
//   }
//   // May be absent; guard when reading
//   form?: { state?: { meta?: { isSubmitted?: boolean } } }
//   handleBlur: () => void
//   handleChange: (value: any) => void
// }

type FieldLike = FieldApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export interface InputProps
  extends Omit<
    React.ComponentPropsWithoutRef<'input'>,
    'id' | 'name' | 'value' | 'onChange' | 'onBlur'
  > {
  field: FieldLike;
  label?: string;
  help?: string;
  parse?: (v: string) => any;
  format?: (v: any) => string;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

function toMessage(err: string | object): string | undefined {
  if (typeof err === 'string') {
    return err;
  }

  if (Array.isArray(err)) {
    err = err[0];
  }

  if (err && typeof err === 'object' && 'message' in err) {
    const errorObject = err as { message: unknown };

    if (typeof errorObject.message === 'string') {
      return errorObject.message;
    }
  }

  return undefined;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      field,
      label,
      help,
      parse,
      format,
      type = 'text',
      wrapperClassName,
      inputClassName,
      labelClassName,
      className,
      ...props
    },
    ref,
  ) {
    const canSubmit = field.form?.state?.canSubmit;
    const isSubmitted = field.form?.state?.isSubmitted;
    const revealErrors = canSubmit === false || !!isSubmitted;
    const message = toMessage(field.state.meta.errorMap?.onChange);
    const hasError = revealErrors && !!message;
    const errId = `${field.name}-error`;
    const helpId = `${field.name}-help`;

    return (
      <div className={cn('space-y-2', wrapperClassName, className)}>
        {label && (
          <Label
            htmlFor={field.name}
            className={cn('text-zinc-300', labelClassName)}
          >
            {label}
          </Label>
        )}

        <UIInput
          ref={ref}
          id={field.name}
          name={field.name}
          type={type}
          value={format ? format(field.state.value) : (field.state.value ?? '')}
          onBlur={field.handleBlur}
          onChange={(e) =>
            field.handleChange(
              parse ? parse(e.currentTarget.value) : e.currentTarget.value,
            )
          }
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errId : help ? helpId : undefined}
          className={cn(
            'bg-zinc-800/70 border-zinc-700 text-zinc-200 placeholder-zinc-500',
            'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 ring-offset-[#0b0d12]',
            inputClassName,
          )}
          {...props}
        />

        {hasError ? (
          <p id={errId} role="alert" className="text-xs text-red-400">
            {message}
          </p>
        ) : help ? (
          <p id={helpId} className="text-xs text-zinc-500">
            {help}
          </p>
        ) : null}
      </div>
    );
  },
);
