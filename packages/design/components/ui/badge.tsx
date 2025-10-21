import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-600 text-white hover:bg-primary-700', // Accessible Orange
        secondary: 'border-transparent bg-secondary-600 text-white hover:bg-secondary-700', // Accessible Blue
        navy: 'border-transparent bg-navy-950 text-white hover:bg-navy-900', // Accessible Navy
        teal: 'border-transparent bg-accent-600 text-white hover:bg-accent-700', // Accessible Teal
        destructive: 'border-transparent bg-error-600 text-white hover:bg-error-700',
        outline: 'text-gray-600 border-gray-600',
        success: 'border-transparent bg-accent-600 text-white hover:bg-accent-700', // Accessible teal for success
        warning: 'border-transparent bg-primary-600 text-white hover:bg-primary-700', // Accessible orange for warning
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };