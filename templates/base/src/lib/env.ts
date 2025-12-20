import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_APP_TITLE: z.string().min(1),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = Object.freeze({
  apiUrl: parsed.data.VITE_API_URL,
  appTitle: parsed.data.VITE_APP_TITLE,
});
