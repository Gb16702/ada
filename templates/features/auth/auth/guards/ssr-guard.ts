import { redirect } from '@tanstack/react-router';
import { authConfig } from '../config';
import type { User, Session } from '../types';

interface SSRAuthResult {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}

export async function getServerSession(
  request: Request
): Promise<SSRAuthResult> {
  try {
    const cookie = request.headers.get('cookie');

    if (!cookie) {
      return { user: null, session: null, isAuthenticated: false };
    }

    const response = await fetch(`${authConfig.backendUrl}/session`, {
      headers: { cookie },
      credentials: 'include',
    });

    if (!response.ok) {
      return { user: null, session: null, isAuthenticated: false };
    }

    const data = await response.json();

    return {
      user: data.user,
      session: data.session,
      isAuthenticated: !!data.user && !!data.session,
    };
  } catch {
    return { user: null, session: null, isAuthenticated: false };
  }
}

interface CreateSSRGuardOptions {
  redirectTo?: string;
}

export function createSSRGuard(options: CreateSSRGuardOptions = {}) {
  const { redirectTo = '/login' } = options;

  return async function guard(request: Request) {
    const { isAuthenticated } = await getServerSession(request);

    if (!isAuthenticated) {
      const currentUrl = new URL(request.url);
      const returnUrl = encodeURIComponent(currentUrl.pathname + currentUrl.search);

      throw redirect({
        to: `${redirectTo}?returnUrl=${returnUrl}`,
      });
    }
  };
}

export function createAuthLoader() {
  return async function loader(request: Request): Promise<SSRAuthResult> {
    return getServerSession(request);
  };
}
