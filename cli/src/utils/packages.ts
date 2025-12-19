export interface PackageJson {
  name: string;
  version: string;
  type?: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export function mergePackageJson(
  base: PackageJson,
  additions: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  }
): PackageJson {
  const result = { ...base };

  if (additions.dependencies) {
    result.dependencies = sortObject({
      ...result.dependencies,
      ...additions.dependencies,
    });
  }

  if (additions.devDependencies) {
    result.devDependencies = sortObject({
      ...result.devDependencies,
      ...additions.devDependencies,
    });
  }

  if (additions.scripts) {
    result.scripts = {
      ...result.scripts,
      ...additions.scripts,
    };
  }

  return result;
}

function sortObject<T extends Record<string, string>>(obj: T): T {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = obj[key];
  }

  return sorted as T;
}

export function createBasePackageJson(projectName: string): PackageJson {
  return {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    private: true,
    scripts: {
      dev: 'vite dev',
      build: 'vite build',
      start: 'vite preview',
      lint: 'biome lint .',
      format: 'biome format --write .',
      check: 'biome check --write .',
      typecheck: 'tsc --noEmit',
    },
    dependencies: {
      '@radix-ui/react-label': '^2.1.8',
      '@radix-ui/react-slot': '^1.2.4',
      '@radix-ui/react-toast': '^1.2.4',
      '@tailwindcss/vite': '^4.0.6',
      '@tanstack/react-router': '^1.132.0',
      '@tanstack/react-start': '^1.132.0',
      '@tanstack/router-plugin': '^1.132.0',
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'lucide-react': '^0.544.0',
      nitro: 'latest',
      react: '^19.2.0',
      'react-dom': '^19.2.0',
      tailwindcss: '^4.0.6',
      'tailwind-merge': '^3.0.2',
      'vite-tsconfig-paths': '^5.1.4',
    },
    devDependencies: {
      '@biomejs/biome': '^2.2.4',
      '@types/react': '^19.2.0',
      '@types/react-dom': '^19.2.0',
      '@vitejs/plugin-react': '^5.0.4',
      typescript: '^5.7.2',
      vite: '^7.1.7',
    },
  };
}

export function addTestingScripts(
  pkg: PackageJson,
  hasE2E: boolean
): PackageJson {
  const scripts: Record<string, string> = {
    test: 'bun test',
  };

  if (hasE2E) {
    scripts['test:e2e'] = 'playwright test';
    scripts['test:e2e:ui'] = 'playwright test --ui';
  }

  return mergePackageJson(pkg, { scripts });
}
