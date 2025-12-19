import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormConfig } from '../types';

export function createFormAdapter<TData extends Record<string, unknown>>(
  config: FormConfig<TData>
): UseFormReturn<TData> {
  return useForm<TData>({
    defaultValues: config.defaultValues as TData,
    resolver: zodResolver(config.schema),
  });
}

export { useForm };
