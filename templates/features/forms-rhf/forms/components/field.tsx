import { useFormContext } from 'react-hook-form';
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

export function Field<TData extends Record<string, unknown>>({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  disabled,
  required,
  className,
}: FieldProps<TData>) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : description ? `${name}-description` : undefined
        }
        {...register(name)}
      />
      {description && !error && (
        <p id={`${name}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
