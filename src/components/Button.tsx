import type { ComponentPropsWithRef } from 'react';
import { classes } from './classes.js';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary', size = 'md', loading = false,
  disabled, type = 'button', className, children, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={classes('venhea-button', `venhea-button--${variant}`, `venhea-button--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <span className="venhea-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
