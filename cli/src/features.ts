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
    files: ['src/lib/query-client.ts'],
  },
  'api-client': {
    id: 'api-client',
    name: 'API Client',
    description: 'Type-safe HTTP client',
    templatePath: 'features/api-client',
    dependencies: {},
    files: ['src/lib/api/client.ts', 'src/lib/api/types.ts'],
  },
  'tests-unit': {
    id: 'tests-unit',
    name: 'Unit Tests',
    description: 'Bun test runner',
    templatePath: 'features/tests-unit',
    dependencies: {},
    devDependencies: {},
    files: ['tests/example.test.ts'],
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

  if (featureSet.apiClient) {
    features.push('api-client');
  }

  if (featureSet.testing) {
    features.push('tests-unit');
  }

  if (featureSet.githubActions) {
    features.push('github-actions');
  }

  return features;
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
