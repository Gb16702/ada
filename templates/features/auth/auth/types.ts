export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  loginWithMagicLink: (email: string) => Promise<void>;
  loginWithOIDC: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export type AuthContext = AuthState & AuthActions;

export interface LoginWithMagicLinkRequest {
  email: string;
  callbackUrl?: string;
}

export interface LoginWithOIDCRequest {
  provider: string;
  callbackUrl?: string;
}

export interface AuthConfig {
  backendUrl: string;
  providers: {
    magicLink: boolean;
    oidc: string[];
  };
}
