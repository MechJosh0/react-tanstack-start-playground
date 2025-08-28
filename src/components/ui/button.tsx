import * as React from 'react';
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
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
