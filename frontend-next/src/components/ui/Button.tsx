'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/src/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500',
      primary: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
      secondary: 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500',
      ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
      outline: 'border border-slate-600 bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
