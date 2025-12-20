import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_APP_TITLE: z.string().min(1),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(parsed.error.format())}`
  );
}

export const env = Object.freeze({
  apiUrl: parsed.data.VITE_API_URL ?? null,
  appTitle: parsed.data.VITE_APP_TITLE,
});
