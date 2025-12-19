import type { FormHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AppFormInstance } from '../types';

interface FormProps<TData extends Record<string, unknown>>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: AppFormInstance<TData>;
  children: ReactNode;
}

export function Form<TData extends Record<string, unknown>>({
  form,
  children,
  className,
  ...props
}: FormProps<TData>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </form>
  );
}
