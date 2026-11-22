import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { classes } from './classes.js';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'children'> {
  label: string;
  description?: string;
  error?: string;
}

export function Input({
  label, description, error, id, className,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? `aurora-input-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionIds = [describedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="aurora-field">
      <label className="aurora-label" htmlFor={inputId}>{label}</label>
      <input
        {...props}
        id={inputId}
        className={classes('aurora-input', Boolean(error) && 'aurora-input--error', className)}
        aria-describedby={descriptionIds}
        aria-invalid={error ? true : invalid}
      />
      {description && <p className="aurora-field-description" id={descriptionId}>{description}</p>}
      {error && <p className="aurora-field-error" id={errorId}>{error}</p>}
    </div>
  );
}
