import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import type { ZodType, ZodTypeDef } from "zod";
import type { AppFormInstance, FieldState } from "../types";

interface UseAppFormConfig<TData extends Record<string, unknown>> {
  schema: ZodType<TData, ZodTypeDef, unknown>;
  defaultValues: TData;
  onSubmit: (values: TData) => void | Promise<void>;
}

export function useAppForm<TData extends Record<string, unknown>>(
  config: UseAppFormConfig<TData>,
): AppFormInstance<TData> {
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

  const getFieldState = (name: keyof TData & string): FieldState => {
    const fieldMeta = form.state.fieldMeta[name];
    return {
      value: form.state.values[name],
      errors: fieldMeta?.errors ?? [],
      isTouched: fieldMeta?.isTouched ?? false,
      isDirty: fieldMeta?.isDirty ?? false,
    };
  };

  const setFieldValue = (name: keyof TData & string, value: unknown): void => {
    form.setFieldValue(name, value as TData[typeof name]);
  };

  const errors: Partial<Record<keyof TData, string>> = {};
  for (const key of Object.keys(config.defaultValues) as (keyof TData &
    string)[]) {
    const fieldErrors = form.state.fieldMeta[key]?.errors;
    if (fieldErrors && fieldErrors.length > 0) {
      errors[key] = fieldErrors[0];
    }
  }

  return {
    values: form.state.values as TData,
    errors,
    isSubmitting: form.state.isSubmitting,
    isValid: form.state.isValid,
    isDirty: form.state.isDirty,

    handleSubmit: () => form.handleSubmit(),
    reset: () => form.reset(),

    getFieldState,
    setFieldValue,

    _internal: form,
  };
}
