import type { ComponentPropsWithRef } from 'react';
import { classes } from './classes.js';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  return <span {...props} className={classes('aurora-badge', `aurora-badge--${variant}`, className)} />;
}
