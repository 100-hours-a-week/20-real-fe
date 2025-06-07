'use client';

import clsx from 'clsx';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'plain';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'default',
  loading = false,
  icon,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    destructive: 'bg-error-500 hover:bg-error-600 text-white',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    plain: 'text-gray-700',
  };

  const sizeClasses: Record<Size, string> = {
    default: 'h-9 px-4 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-10 px-6 text-base',
    icon: 'h-9 w-9 p-0 rounded-full',
  };

  const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);

  return (
    <button type={type} className={classes} disabled={isDisabled} {...props}>
      <span className="relative inline-flex items-center justify-center gap-2 w-full">
        <span
          className={`${loading ? 'invisible' : ''} relative  inline-flex items-center justify-center gap-2 w-full`}
        >
          {icon}
          {children}
        </span>

        {loading && (
          <span className="absolute animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
      </span>
    </button>
  );
}
