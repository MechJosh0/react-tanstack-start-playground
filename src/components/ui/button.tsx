import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-[#0b0d12]',
  {
    variants: {
      variant: {
        default:
          'bg-red-400 text-white hover:bg-red-500 focus-visible:ring-red-400',
        secondary:
          'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 focus-visible:ring-zinc-600',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        outline:
          'bg-transparent text-zinc-200 border border-zinc-700 hover:bg-zinc-800/60 focus-visible:ring-zinc-600',
        ghost:
          'bg-transparent text-zinc-200 hover:bg-zinc-800/50 focus-visible:ring-zinc-600',
        link: 'bg-transparent p-0 rounded-none text-zinc-300 underline underline-offset-4 hover:text-red-400 focus-visible:ring-0',
      },
      size: {
        default: '',
        sm: 'px-3 py-1 text-sm',
        lg: 'px-7 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  errorMessage,
  errorProps,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    errorMessage?: string;
    errorProps?: React.HTMLAttributes<HTMLParagraphElement>;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <div className={cn('inline-flex flex-col gap-1', className && undefined)}>
      <Comp
        data-slot="button"
        aria-invalid={errorMessage ? true : props['aria-invalid']}
        aria-describedby={errorMessage || undefined}
        className={cn(
          buttonVariants({ variant, size }),
          errorMessage && 'ring-red-500 focus-visible:ring-red-500',
        )}
        {...props}
      />
      <p
        role="alert"
        className={cn('text-sm text-red-400 pt-1')}
        {...errorProps}
      >
        {errorMessage}
      </p>
    </div>
  );
}

export { Button, buttonVariants };
