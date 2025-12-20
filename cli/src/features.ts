import type { FeatureDefinition, FeatureSet } from './types';

export const featureDefinitions: Record<string, FeatureDefinition> = {
  'tanstack-query': {
    id: 'tanstack-query',
    name: 'TanStack Query',
    description: 'Powerful data fetching and caching',
    templatePath: 'features/tanstack-query',
    dependencies: {
      '@tanstack/react-query': '^5.62.7',
    },
    files: ['lib/query-client.ts'],
  },
  'tanstack-form': {
    id: 'tanstack-form',
    name: 'TanStack Form',
    description: 'Type-safe form management',
    templatePath: 'features/tanstack-form',
    dependencies: {
      '@tanstack/react-form': '^1.27.1',
    },
    files: [
      'forms/index.ts',
      'forms/types.ts',
      'forms/adapters/tanstack-adapter.ts',
      'forms/components/form.tsx',
      'forms/components/field.tsx',
      'forms/hooks/use-app-form.ts',
    ],
  },
  'forms-rhf': {
    id: 'forms-rhf',
    name: 'React Hook Form',
    description: 'Performant form management',
    templatePath: 'features/forms-rhf',
    dependencies: {
      'react-hook-form': '^7.54.2',
      '@hookform/resolvers': '^3.9.1',
    },
    files: [
      'forms/index.ts',
      'forms/types.ts',
      'forms/adapters/rhf-adapter.ts',
      'forms/components/form.tsx',
      'forms/components/field.tsx',
      'forms/hooks/use-app-form.ts',
    ],
  },
  'api-client': {
    id: 'api-client',
    name: 'API Client',
    description: 'Type-safe HTTP client',
    templatePath: 'features/api-client',
    dependencies: {},
    files: ['lib/api/client.ts', 'lib/api/types.ts'],
  },
  'env-validation': {
    id: 'env-validation',
    name: 'Environment Validation',
    description: 'Zod-based env validation',
    templatePath: 'features/env-validation',
    dependencies: {},
    files: ['lib/env.ts'],
  },
  'tests-unit': {
    id: 'tests-unit',
    name: 'Unit Tests',
    description: 'Bun test runner with Testing Library',
    templatePath: 'features/tests-unit',
    dependencies: {},
    devDependencies: {
      '@testing-library/react': '^16.1.0',
      '@testing-library/dom': '^10.4.0',
      'happy-dom': '^15.11.7',
    },
    files: ['tests/setup.ts', 'tests/example.test.tsx', 'bunfig.toml'],
  },
  'tests-e2e': {
    id: 'tests-e2e',
    name: 'E2E Tests',
    description: 'Playwright for end-to-end testing',
    templatePath: 'features/tests-e2e',
    dependencies: {},
    devDependencies: {
      '@playwright/test': '^1.49.1',
    },
    files: ['tests/e2e/example.spec.ts', 'playwright.config.ts'],
  },
  auth: {
    id: 'auth',
    name: 'Auth Skeleton',
    description: 'Authentication skeleton for Better Auth',
    templatePath: 'features/auth',
    dependencies: {},
    files: [
      'auth/index.ts',
      'auth/types.ts',
      'auth/config.ts',
      'auth/provider.tsx',
      'auth/hooks/use-auth.ts',
      'auth/guards/protected-route.tsx',
      'auth/guards/ssr-guard.ts',
    ],
  },
  'state-zustand': {
    id: 'state-zustand',
    name: 'Zustand',
    description: 'Lightweight state management',
    templatePath: 'features/state-zustand',
    dependencies: {
      zustand: '^5.0.2',
    },
    files: ['lib/store.ts'],
  },
  'error-boundaries': {
    id: 'error-boundaries',
    name: 'Error Boundaries',
    description: 'Error handling components',
    templatePath: 'features/error-boundaries',
    dependencies: {},
    files: ['components/error-boundary.tsx', 'components/route-error.tsx'],
  },
  'ui-forms': {
    id: 'ui-forms',
    name: 'UI Forms Bundle',
    description: 'Select, Checkbox, Radio, Switch components',
    templatePath: 'features/ui-bundles/forms',
    dependencies: {
      '@radix-ui/react-select': '^2.1.4',
      '@radix-ui/react-checkbox': '^1.1.3',
      '@radix-ui/react-radio-group': '^1.2.2',
      '@radix-ui/react-switch': '^1.1.2',
    },
    files: [
      'components/ui/select.tsx',
      'components/ui/checkbox.tsx',
      'components/ui/radio-group.tsx',
      'components/ui/switch.tsx',
    ],
  },
  'ui-data-display': {
    id: 'ui-data-display',
    name: 'UI Data Display Bundle',
    description: 'Table, Badge, Avatar components',
    templatePath: 'features/ui-bundles/data-display',
    dependencies: {
      '@radix-ui/react-avatar': '^1.1.2',
    },
    files: [
      'components/ui/table.tsx',
      'components/ui/badge.tsx',
      'components/ui/avatar.tsx',
    ],
  },
  'ui-overlays': {
    id: 'ui-overlays',
    name: 'UI Overlays Bundle',
    description: 'Dialog, Sheet, Dropdown components',
    templatePath: 'features/ui-bundles/overlays',
    dependencies: {
      '@radix-ui/react-dialog': '^1.1.4',
      '@radix-ui/react-dropdown-menu': '^2.1.4',
    },
    files: [
      'components/ui/dialog.tsx',
      'components/ui/sheet.tsx',
      'components/ui/dropdown-menu.tsx',
    ],
  },
  'github-actions': {
    id: 'github-actions',
    name: 'GitHub Actions CI',
    description: 'CI workflow for lint, typecheck, and tests (dynamically generated)',
    templatePath: null,
    dependencies: {},
    files: ['.github/workflows/ci.yml'],
  },
};

export function getRequiredFeatures(featureSet: FeatureSet): string[] {
  const features: string[] = [];

  if (featureSet.tanstackQuery) {
    features.push('tanstack-query');
  }

  if (featureSet.forms === 'tanstack-form') {
    features.push('tanstack-form');
  } else if (featureSet.forms === 'react-hook-form') {
    features.push('forms-rhf');
  }

  if (featureSet.apiClient) {
    features.push('api-client');
  }

  if (featureSet.envValidation) {
    features.push('env-validation');
  }

  if (featureSet.testing === 'unit' || featureSet.testing === 'unit-e2e') {
    features.push('tests-unit');
  }

  if (featureSet.testing === 'unit-e2e') {
    features.push('tests-e2e');
  }

  if (featureSet.auth) {
    features.push('auth');
  }

  if (featureSet.state === 'zustand') {
    features.push('state-zustand');
  }

  if (featureSet.errorBoundaries) {
    features.push('error-boundaries');
  }

  if (featureSet.githubActions) {
    features.push('github-actions');
  }

  for (const bundle of featureSet.uiBundles) {
    if (bundle === 'forms') {
      features.push('ui-forms');
    } else if (bundle === 'data-display') {
      features.push('ui-data-display');
    } else if (bundle === 'overlays') {
      features.push('ui-overlays');
    } else if (bundle === 'full') {
      features.push('ui-forms', 'ui-data-display', 'ui-overlays');
    }
  }

  return [...new Set(features)];
}

export function getFeatureDependencies(featureIds: string[]): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  for (const id of featureIds) {
    const feature = featureDefinitions[id];
    if (feature) {
      Object.assign(dependencies, feature.dependencies);
      if (feature.devDependencies) {
        Object.assign(devDependencies, feature.devDependencies);
      }
    }
  }

  return { dependencies, devDependencies };
}
