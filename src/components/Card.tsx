import type { ComponentPropsWithRef } from 'react';
import { classes } from './classes.js';

export type CardProps = ComponentPropsWithRef<'div'>;

export function Card({ className, ...props }: CardProps) {
  return <div {...props} className={classes('venhea-card', className)} />;
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div {...props} className={classes('venhea-card-header', className)} />;
}

export function CardBody({ className, ...props }: CardProps) {
  return <div {...props} className={classes('venhea-card-body', className)} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div {...props} className={classes('venhea-card-footer', className)} />;
}
