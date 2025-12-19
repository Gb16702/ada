import type { ReactNode } from 'react';
import type { ZodType, ZodTypeDef } from 'zod';

export interface FormConfig<TData extends Record<string, unknown>> {
  schema: ZodType<TData, ZodTypeDef, unknown>;
  defaultValues: TData;
  onSubmit: (values: TData) => void | Promise<void>;
}

export interface FieldState {
  value: unknown;
  errors: string[];
  isTouched: boolean;
  isDirty: boolean;
}

export interface AppFormInstance<TData extends Record<string, unknown>> {
  values: TData;
  errors: Partial<Record<keyof TData, string>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;

  handleSubmit: () => void;
  reset: () => void;

  getFieldState: (name: keyof TData & string) => FieldState;
  setFieldValue: (name: keyof TData & string, value: unknown) => void;

  // Internal - used by Field component, not by business code
  _internal: unknown;
}

export interface FieldConfig {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}
