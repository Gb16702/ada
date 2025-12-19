# create-ada

Professional, opinionated frontend boilerplate with CLI generator.

## Features

- **SSR-First** - Server-side rendering by default with TanStack Start
- **React 19** - Latest React with improved performance
- **TypeScript Strict** - Full type safety with strict mode
- **Tailwind CSS + shadcn/ui** - Modern styling with accessible components
- **Biome** - Fast linting and formatting (replaces ESLint + Prettier)
- **TanStack Query** - Powerful data fetching and caching
- **Form Abstraction** - Library-agnostic form handling
- **Auth Skeleton** - Ready for Better Auth integration
- **Testing** - Bun test runner + Playwright E2E

## Quick Start

```bash
# Create a new project
bun create ada my-project

# With a specific preset
bun create ada my-project --preset standard

# Non-interactive
bun create ada my-project --preset enterprise --yes
```

## Presets

| Preset | Description |
|--------|-------------|
| **Minimal** | Core only - React, TanStack Start, TypeScript, Tailwind, Biome |
| **Standard** | + TanStack Query, Forms, API client, env validation, unit tests |
| **Enterprise** | + Auth skeleton, Zustand, route guards, error boundaries, E2E |
| **Custom** | Choose your own features |

## Architecture

Generated projects follow a **feature-first** architecture:

```
my-project/
├── app/
│   └── routes/          # TanStack Start file-based routing
├── features/            # Business logic modules
├── components/
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities and helpers
├── forms/               # Form abstraction (if included)
├── auth/                # Auth skeleton (Enterprise)
├── tests/               # Test files
└── styles/              # Global styles
```

## Philosophy

### SSR-First

- All routes are server-rendered by default
- Critical data loaded via server loaders
- HTML exploitable for SEO and performance
- CSR used only for interactivity and mutations

### Form Abstraction

Business code never imports library-specific code:

```typescript
// features/contact/contact-form.tsx
import { Form, Field, useAppForm } from '@/forms';

function ContactForm() {
  const form = useAppForm({
    schema: contactSchema,
    defaultValues: { name: '', email: '' },
    onSubmit: async (values) => { /* ... */ },
  });

  return (
    <Form form={form}>
      <Field name="name" label="Name" />
      <Field name="email" label="Email" type="email" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Auth Skeleton

Ready for Better Auth backend integration:

```typescript
import { useAuth } from '@/auth';

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <LoginButton />;

  return <Button onClick={logout}>{user?.name}</Button>;
}
```

## Development

```bash
# Install dependencies
bun install

# Run CLI in development
bun run dev

# Build CLI for distribution
bun run build
```

## Project Structure

```
create-ada/
├── cli/                 # CLI source code
│   └── src/
│       ├── index.ts     # Entry point
│       ├── prompts.ts   # Interactive prompts
│       ├── presets.ts   # Preset definitions
│       ├── features.ts  # Feature definitions
│       ├── generator.ts # Project generation
│       └── utils/       # Utilities
├── templates/
│   ├── base/            # Core template (always included)
│   └── features/        # Optional feature templates
└── package.json
```

## License

MIT
