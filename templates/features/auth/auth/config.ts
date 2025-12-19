import { z } from 'zod';
import type { AuthConfig } from './types';

const authConfigSchema = z.object({
  backendUrl: z.string().url(),
  providers: z.object({
    magicLink: z.boolean().default(true),
    oidc: z.array(z.string()).default([]),
  }),
});

function loadAuthConfig(): AuthConfig {
  const rawConfig = {
    backendUrl: import.meta.env.VITE_AUTH_URL ?? 'http://localhost:3000/api/auth',
    providers: {
      magicLink: import.meta.env.VITE_AUTH_MAGIC_LINK !== 'false',
      oidc: import.meta.env.VITE_AUTH_OIDC_PROVIDERS?.split(',').filter(Boolean) ?? [],
    },
  };

  const result = authConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    console.warn('Invalid auth configuration, using defaults:', result.error.flatten());
    return {
      backendUrl: 'http://localhost:3000/api/auth',
      providers: {
        magicLink: true,
        oidc: [],
      },
    };
  }

  return result.data;
}

export const authConfig = loadAuthConfig();
