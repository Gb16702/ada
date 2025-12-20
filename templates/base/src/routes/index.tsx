import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1>Welcome to Ada</h1>
        <p>A modern frontend boilerplate built with TanStack Start</p>
      </div>

      <div className="flex gap-4">
        <Button>Get Started</Button>
        <Button variant="secondary">Documentation</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="SSR-First"
          description="Server-side rendering by default for optimal performance and SEO"
        />
        <FeatureCard
          title="Type-Safe"
          description="Full TypeScript support with strict mode enabled"
        />
        <FeatureCard
          title="Modern Stack"
          description="React 19, TanStack Start, Tailwind CSS, and more"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-ds-border-input bg-ds-background-100 p-6">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
