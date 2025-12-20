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
      prepare: 'husky',
      'pre-commit': 'lint-staged',
    },
    'lint-staged': {
      '*.{ts,tsx,js,jsx,json,css}': 'biome check --write --no-errors-on-unmatched',
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
      zod: '^4.1.13',
    },
    devDependencies: {
      '@biomejs/biome': '^1.9.4',
      '@types/react': '^19.2.0',
      '@types/react-dom': '^19.2.0',
      '@vitejs/plugin-react': '^5.0.4',
      husky: '^9.1.7',
      'lint-staged': '^16.1.0',
      typescript: '^5.7.2',
      vite: '^7.1.7',
    },
  };
}

export function addTestingScripts(pkg: PackageJson): PackageJson {
  return mergePackageJson(pkg, {
    scripts: { test: 'bun test' },
  });
}
