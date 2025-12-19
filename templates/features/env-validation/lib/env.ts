import { z } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(false),
  SSR: z.boolean().default(false),

  VITE_API_URL: z.string().url().optional(),
  VITE_APP_TITLE: z.string().default('Ada App'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const rawEnv = {
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    SSR: import.meta.env.SSR,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${errorMessages}`);
  }

  return result.data;
}

export const env = validateEnv();

export type { Env };
