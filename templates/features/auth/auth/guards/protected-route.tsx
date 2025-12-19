import type { ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  fallback,
  loadingFallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return loadingFallback ?? <DefaultLoadingFallback />;
  }

  if (!isAuthenticated) {
    return fallback ?? <DefaultUnauthenticatedFallback />;
  }

  return <>{children}</>;
}

function DefaultLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

function DefaultUnauthenticatedFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground">
        You must be logged in to view this page.
      </p>
    </div>
  );
}
