import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

interface RouteErrorProps {
  error: Error;
  reset?: () => void;
}

export function RouteError({ error, reset }: RouteErrorProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  const handleGoHome = () => {
    router.navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Something went wrong while loading this page.
        </p>
        {import.meta.env.DEV && (
          <div className="mt-4 max-w-2xl">
            <pre className="overflow-auto rounded-md bg-muted p-4 text-left text-sm">
              <code>{error.message}</code>
            </pre>
            {error.stack && (
              <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted p-4 text-left text-xs text-muted-foreground">
                <code>{error.stack}</code>
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {reset && <Button onClick={reset}>Try again</Button>}
        <Button variant="outline" onClick={handleGoBack}>
          Go back
        </Button>
        <Button variant="outline" onClick={handleGoHome}>
          Go home
        </Button>
      </div>
    </div>
  );
}

export function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  const handleGoHome = () => {
    router.navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleGoBack}>Go back</Button>
        <Button variant="outline" onClick={handleGoHome}>
          Go home
        </Button>
      </div>
    </div>
  );
}
