import type { FormApi, ReactFormApi } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { AppFormInstance } from '../types';

interface FieldProps<TData extends Record<string, unknown>> {
  form: AppFormInstance<TData>;
  name: keyof TData & string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

type InternalForm<TData> = FormApi<TData, unknown> & ReactFormApi<TData, unknown>;

export function Field<TData extends Record<string, unknown>>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  description,
  disabled,
  required,
  className,
}: FieldProps<TData>) {
  const internalForm = form._internal as InternalForm<TData>;

  return (
    <internalForm.Field name={name}>
      {(field) => (
        <div className={cn('space-y-2', className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
          )}
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={String(field.state.value ?? '')}
            onChange={(e) =>
              field.handleChange(e.target.value as TData[typeof name])
            }
            onBlur={field.handleBlur}
            aria-invalid={field.state.meta.errors.length > 0}
            aria-describedby={
              field.state.meta.errors.length > 0
                ? `${name}-error`
                : description
                  ? `${name}-description`
                  : undefined
            }
          />
          {description && !field.state.meta.errors.length && (
            <p
              id={`${name}-description`}
              className="text-sm text-muted-foreground"
            >
              {description}
            </p>
          )}
          {field.state.meta.errors.length > 0 && (
            <p id={`${name}-error`} className="text-sm text-destructive">
              {field.state.meta.errors[0]}
            </p>
          )}
        </div>
      )}
    </internalForm.Field>
  );
}
