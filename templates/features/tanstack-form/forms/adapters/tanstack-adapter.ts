import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import type { FormConfig, FormInstance, FormState } from '../types';

export function createFormAdapter<TData extends Record<string, unknown>>(
  config: FormConfig<TData>
): FormInstance<TData> {
  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      await config.onSubmit(value as TData);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: config.schema,
    },
  });

  const state: FormState<TData> = {
    values: form.state.values as TData,
    errors: Object.fromEntries(
      Object.keys(config.defaultValues).map((key) => [
        key,
        form.state.fieldMeta[key]?.errors?.[0],
      ])
    ) as Record<keyof TData, string | undefined>,
    isSubmitting: form.state.isSubmitting,
    isValid: form.state.isValid,
    isDirty: form.state.isDirty,
  };

  return {
    state,
    handleSubmit: (e) => {
      e?.preventDefault();
      form.handleSubmit();
    },
    reset: () => form.reset(),
    Field: () => null,
  };
}

export { useForm };
