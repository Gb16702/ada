import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authConfig } from './config';
import type {
  AuthContext as AuthContextType,
  AuthState,
  Session,
  User,
} from './types';

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  };

  const setAuth = (user: User | null, session: Session | null) => {
    setState({
      user,
      session,
      isAuthenticated: !!user && !!session,
      isLoading: false,
      error: null,
    });
  };

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${authConfig.backendUrl}/session`, {
        credentials: 'include',
      });

      if (!response.ok) {
        setAuth(null, null);
        return;
      }

      const data = await response.json();
      setAuth(data.user, data.session);
    } catch {
      setAuth(null, null);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const loginWithMagicLink = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${authConfig.backendUrl}/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          callbackUrl: window.location.origin,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? 'Failed to send magic link');
      }

      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  }, []);

  const loginWithOIDC = useCallback(async (provider: string) => {
    try {
      setLoading(true);
      setError(null);

      const callbackUrl = encodeURIComponent(window.location.origin);
      window.location.href = `${authConfig.backendUrl}/oauth/${provider}?callbackUrl=${callbackUrl}`;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await fetch(`${authConfig.backendUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      setAuth(null, null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to logout');
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      loginWithMagicLink,
      loginWithOIDC,
      logout,
      refreshSession,
      clearError,
    }),
    [state, loginWithMagicLink, loginWithOIDC, logout, refreshSession, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
