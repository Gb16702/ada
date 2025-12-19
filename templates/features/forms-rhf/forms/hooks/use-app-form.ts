import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType, ZodTypeDef } from 'zod';
import type { AppFormInstance, FieldState } from '../types';

interface UseAppFormConfig<TData extends Record<string, unknown>> {
  schema: ZodType<TData, ZodTypeDef, unknown>;
  defaultValues: TData;
  onSubmit: (values: TData) => void | Promise<void>;
}

export function useAppForm<TData extends Record<string, unknown>>(
  config: UseAppFormConfig<TData>
): AppFormInstance<TData> {
  const form = useForm<TData>({
    defaultValues: config.defaultValues as TData,
    resolver: zodResolver(config.schema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await config.onSubmit(values);
  });

  const getFieldState = (name: keyof TData & string): FieldState => {
    const fieldState = form.getFieldState(name);
    return {
      value: form.getValues(name),
      errors: fieldState.error?.message ? [fieldState.error.message] : [],
      isTouched: fieldState.isTouched,
      isDirty: fieldState.isDirty,
    };
  };

  const setFieldValue = (name: keyof TData & string, value: unknown): void => {
    form.setValue(name, value as TData[typeof name]);
  };

  const errors: Partial<Record<keyof TData, string>> = {};
  for (const key of Object.keys(config.defaultValues) as (keyof TData & string)[]) {
    const error = form.formState.errors[key];
    if (error?.message) {
      errors[key] = error.message as string;
    }
  }

  return {
    values: form.getValues(),
    errors,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,

    handleSubmit: () => onSubmit(),
    reset: () => form.reset(),

    getFieldState,
    setFieldValue,

    _internal: form,
  };
}
