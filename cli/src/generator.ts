import * as p from '@clack/prompts';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { getFeatureDependencies, getRequiredFeatures } from './features';
import type { FeatureSet, ProjectConfig, ThemeColor } from './types';
import { ensureDir, listDirEntries, pathExists, readFile, writeFile } from './utils/fs';
import {
    addTestingScripts,
    createBasePackageJson,
    mergePackageJson,
} from './utils/packages';
import { generateActionColors } from './utils/theme';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getTemplatesDir(): string {
  return join(__dirname, '..', '..', 'templates');
}

export async function generateProject(config: ProjectConfig): Promise<boolean> {
  const spinner = p.spinner();
  const targetDir = join(process.cwd(), config.name);

  if (await pathExists(targetDir)) {
    p.log.error(`Directory ${pc.red(config.name)} already exists.`);
    return false;
  }

  try {
    spinner.start('Creating project structure...');

    await ensureDir(targetDir);

    const templatesDir = getTemplatesDir();
    const baseDir = join(templatesDir, 'base');

    await copyBaseTemplate(baseDir, targetDir);

    spinner.message('Adding selected features...');

    const featureIds = getRequiredFeatures(config.features);
    await copyFeatureTemplates(templatesDir, targetDir, featureIds);

    spinner.message('Generating package.json...');

    await generatePackageJson(targetDir, config);

    spinner.message('Generating README...');

    await generateReadme(targetDir, config);

    await generateRootLayout(templatesDir, targetDir, config.features);

    spinner.message('Applying theme...');

    await applyTheme(targetDir, config.theme);

    spinner.message('Generating .env.example...');

    await generateEnvExample(targetDir, config.name, config.features);

    if (config.features.githubActions) {
      spinner.message('Generating CI workflow...');
      await generateCIWorkflow(targetDir, config.features);
    }

    spinner.message('Initializing git repository...');
    await initGitRepository(targetDir);

    spinner.stop('Project created successfully!');

    printNextSteps(config.name);

    return true;
  } catch (error) {
    spinner.stop('Failed to create project.');
    p.log.error(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
    return false;
  }
}

async function copyBaseTemplate(
  baseDir: string,
  targetDir: string
): Promise<void> {
  async function copyRecursive(src: string, dest: string): Promise<void> {
    await ensureDir(dest);

    const entries = await listDirEntries(src);

    for (const entry of entries) {
      const srcPath = join(src, entry.name);

      if (entry.isDirectory) {
        await copyRecursive(srcPath, join(dest, entry.name));
      } else {
        if (entry.name.endsWith('.template.tsx')) {
          continue;
        }

        const content = await readFile(srcPath);
        await writeFile(join(dest, entry.name), content);
      }
    }
  }

  await copyRecursive(baseDir, targetDir);
}

async function copyFeatureTemplates(
  templatesDir: string,
  targetDir: string,
  featureIds: string[]
): Promise<void> {
  const featuresDir = join(templatesDir, 'features');

  for (const featureId of featureIds) {
    if (featureId === 'github-actions') {
      continue;
    }

    const featureDir = join(featuresDir, featureId);

    if (!(await pathExists(featureDir))) {
      continue;
    }

    async function copyFeatureRecursive(src: string, dest: string): Promise<void> {
      await ensureDir(dest);

      const entries = await listDirEntries(src);

      for (const entry of entries) {
        const srcPath = join(src, entry.name);

        if (entry.isDirectory) {
          await copyFeatureRecursive(srcPath, join(dest, entry.name));
        } else {
          const content = await readFile(srcPath);
          await writeFile(join(dest, entry.name), content);
        }
      }
    }

    await copyFeatureRecursive(featureDir, targetDir);
  }
}

async function generatePackageJson(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  let pkg = createBasePackageJson(config.name);

  const featureIds = getRequiredFeatures(config.features);
  const { dependencies, devDependencies } = getFeatureDependencies(featureIds);

  pkg = mergePackageJson(pkg, { dependencies, devDependencies });

  if (
    config.features.testing === 'unit' ||
    config.features.testing === 'unit-e2e'
  ) {
    pkg = addTestingScripts(pkg, config.features.testing === 'unit-e2e');
  }

  const content = JSON.stringify(pkg, null, 2) + '\n';
  await writeFile(join(targetDir, 'package.json'), content);
}

async function generateReadme(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const features = config.features;
  const featureList: string[] = [];

  featureList.push('React 19');
  featureList.push('TanStack Start (SSR)');
  featureList.push('TypeScript (strict mode)');
  featureList.push('Tailwind CSS');
  featureList.push('shadcn/ui');
  featureList.push('Biome (lint + format)');

  if (features.tanstackQuery) {
    featureList.push('TanStack Query');
  }

  if (features.forms !== 'none') {
    const formLib =
      features.forms === 'tanstack-form' ? 'TanStack Form' : 'React Hook Form';
    featureList.push(`Forms (${formLib})`);
  }

  if (features.apiClient) {
    featureList.push('API Client');
  }

  featureList.push('Environment Validation (Zod)');

  if (features.testing !== 'none') {
    const testType =
      features.testing === 'unit' ? 'Unit Tests (Bun)' : 'Unit + E2E Tests';
    featureList.push(testType);
  }

  if (features.auth) {
    featureList.push('Auth Skeleton (Better Auth)');
  }

  if (features.state !== 'none') {
    featureList.push('Zustand (State Management)');
  }

  if (features.errorBoundaries) {
    featureList.push('Error Boundaries');
  }

  const readme = `# ${config.name}

A modern frontend application built with create-ada.

## Features

${featureList.map((f) => `- ${f}`).join('\n')}

## Getting Started

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
| \`bun dev\` | Start development server |
| \`bun build\` | Build for production |
| \`bun start\` | Start production server |
| \`bun lint\` | Run linter |
| \`bun format\` | Format code |
| \`bun check\` | Run all checks |
| \`bun typecheck\` | Type check |
${features.testing !== 'none' ? '| `bun test` | Run unit tests |' : ''}
${features.testing === 'unit-e2e' ? '| `bun test:e2e` | Run E2E tests |' : ''}

## Architecture

This project follows a **feature-first** architecture:

\`\`\`
├── src/
│   ├── routes/          # File-based routing
│   ├── components/ui/   # shadcn/ui components
│   ├── lib/             # Utilities and helpers
${features.forms !== 'none' ? '│   ├── forms/           # Form abstraction layer' : ''}
${features.auth ? '│   ├── auth/            # Authentication' : ''}
│   ├── router.tsx       # Router configuration
│   └── styles/          # CSS (globals.css, theme.css)
├── features/            # Business logic modules
${features.testing !== 'none' ? '├── tests/               # Test files' : ''}
└── public/              # Static assets
\`\`\`

## Philosophy

This project follows an **SSR-first** approach:

- All routes are server-rendered by default
- Critical data is loaded via server loaders
- Client-side rendering is used for interactivity only
- SEO and performance are prioritized

${
  features.forms !== 'none'
    ? `
## Forms

Forms use an abstraction layer to decouple business logic from the form library:

\`\`\`typescript
import { Form, Field, useAppForm } from '@/forms';

function MyForm() {
  const form = useAppForm({
    schema: mySchema,
    defaultValues: { name: '' },
    onSubmit: async (values) => { /* ... */ },
  });

  return (
    <Form form={form}>
      <Field name="name" label="Name" />
      <button type="submit">Submit</button>
    </Form>
  );
}
\`\`\`
`
    : ''
}

${
  features.auth
    ? `
## Authentication

Auth uses a skeleton ready to connect to Better Auth:

\`\`\`typescript
import { useAuth } from '@/auth';

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <LoginButton />;

  return <Button onClick={logout}>{user?.name}</Button>;
}
\`\`\`
`
    : ''
}

## License

Private
`;

  await writeFile(join(targetDir, 'README.md'), readme);
}

async function generateEnvExample(
  targetDir: string,
  projectName: string,
  features: FeatureSet
): Promise<void> {
  const sections: string[] = [];

  const appTitle = projectName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  sections.push(`# Application
VITE_APP_TITLE="${appTitle}"

# API
VITE_API_URL=http://localhost:3000/api`);

  if (features.auth) {
    sections.push(`# Authentication (Better Auth)
VITE_AUTH_URL=http://localhost:3000/api/auth
# Set to "false" to disable magic link authentication
VITE_AUTH_MAGIC_LINK=true
# Comma-separated list of OIDC providers (e.g., "google,github")
VITE_AUTH_OIDC_PROVIDERS=`);
  }

  const content = sections.join('\n\n') + '\n';
  await writeFile(join(targetDir, '.env.example'), content);
}

async function generateRootLayout(
  templatesDir: string,
  targetDir: string,
  features: FeatureSet
): Promise<void> {
  const templatePath = join(templatesDir, 'base', 'src', 'routes', '__root.template.tsx');
  let template = await readFile(templatePath);

  const slots = buildRootLayoutSlots(features);

  template = template.replace('/* @SLOT:IMPORTS */', slots.imports);
  template = template.replace('/* @SLOT:PROVIDERS_SETUP */', slots.providersSetup);
  template = template.replace('/* @SLOT:PROVIDERS_OPEN */', slots.providersOpen);
  template = template.replace('/* @SLOT:PROVIDERS_CLOSE */', slots.providersClose);

  await writeFile(join(targetDir, 'src', 'routes', '__root.tsx'), template);
}

async function applyTheme(
  targetDir: string,
  theme: ThemeColor
): Promise<void> {
  const globalsPath = join(targetDir, 'src', 'styles', 'globals.css');
  let content = await readFile(globalsPath);

  const actionColors = generateActionColors(theme);
  content = content.replace('/* @SLOT:ACTION */', actionColors);

  await writeFile(globalsPath, content);
}

interface RootLayoutSlots {
  imports: string;
  providersSetup: string;
  providersOpen: string;
  providersClose: string;
}

function buildRootLayoutSlots(features: FeatureSet): RootLayoutSlots {
  const imports: string[] = [];
  const providersOpen: string[] = [];
  const providersClose: string[] = [];
  let providersSetup = '';

  if (features.tanstackQuery) {
    imports.push("import { useState } from 'react';");
    imports.push("import { QueryClient, QueryClientProvider } from '@tanstack/react-query';");

    providersSetup = `const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  }));`;

    providersOpen.push('<QueryClientProvider client={queryClient}>');
    providersClose.unshift('</QueryClientProvider>');
  }

  if (features.auth) {
    imports.push("import { AuthProvider } from '@/auth';");
    providersOpen.push('<AuthProvider>');
    providersClose.unshift('</AuthProvider>');
  }

  const finalProvidersOpen = providersOpen.length > 0
    ? providersOpen.join('\n      ')
    : '';

  const finalProvidersClose = providersClose.length > 0
    ? providersClose.join('\n      ')
    : '';

  return {
    imports: imports.length > 0 ? imports.join('\n') : '',
    providersSetup,
    providersOpen: finalProvidersOpen,
    providersClose: finalProvidersClose,
  };
}

async function initGitRepository(targetDir: string): Promise<void> {
  const proc = Bun.spawn(['git', 'init'], {
    cwd: targetDir,
    stdout: 'ignore',
    stderr: 'ignore',
  });
  await proc.exited;

  const branchProc = Bun.spawn(['git', 'branch', '-M', 'main'], {
    cwd: targetDir,
    stdout: 'ignore',
    stderr: 'ignore',
  });
  await branchProc.exited;
}

function printNextSteps(projectName: string): void {
  p.note(
    `cd ${projectName}
bun install
bun dev`,
    'Next steps'
  );

  p.outro(pc.green('Happy coding!'));
}

async function generateCIWorkflow(
  targetDir: string,
  features: FeatureSet
): Promise<void> {
  if (!features.githubActions) {
    return;
  }

  const hasTests = features.testing !== 'none';
  const hasE2E = features.testing === 'unit-e2e';

  const buildNeeds = hasTests ? '[test]' : '[lint, typecheck]';
  const bundleAnalysisNeeds = '[build]';

  let yaml = `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: \${{ runner.os }}-bun-\${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            \${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun lint

      - name: Format check
        run: bun format --check

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: \${{ runner.os }}-bun-\${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            \${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: bun typecheck
`;

  if (hasTests) {
    yaml += `
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: \${{ runner.os }}-bun-\${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            \${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run tests
        run: bun test
`;
  }

  if (hasE2E) {
    yaml += `
  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: \${{ runner.os }}-bun-\${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            \${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Install Playwright browsers
        run: bunx playwright install --with-deps chromium

      - name: Run E2E tests
        run: bun test:e2e
`;
  }

  const buildNeedsValue = hasE2E ? '[test, test-e2e]' : buildNeeds;

  yaml += `
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: ${buildNeedsValue}
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: \${{ runner.os }}-bun-\${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            \${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build
        run: bun run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .output/
          retention-days: 7

  bundle-analysis:
    name: Bundle Analysis
    runs-on: ubuntu-latest
    needs: ${bundleAnalysisNeeds}
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: \${{ runner.os }}-bun-\${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            \${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build and analyze
        run: bun run build 2>&1 | tee build-output.txt

      - name: Extract bundle sizes
        id: bundle
        run: |
          echo "## Bundle Size Report" >> \$GITHUB_STEP_SUMMARY
          echo "" >> \$GITHUB_STEP_SUMMARY
          echo "\\\`\\\`\\\`" >> \$GITHUB_STEP_SUMMARY
          grep -E "\\.js|\\.css" build-output.txt | head -20 >> \$GITHUB_STEP_SUMMARY || echo "No bundle info found" >> \$GITHUB_STEP_SUMMARY
          echo "\\\`\\\`\\\`" >> \$GITHUB_STEP_SUMMARY
`;

  const workflowDir = join(targetDir, '.github', 'workflows');
  await ensureDir(workflowDir);
  await writeFile(join(workflowDir, 'ci.yml'), yaml);
}
