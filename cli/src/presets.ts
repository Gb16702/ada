import type { FeatureSet, PresetDefinition, PresetName } from './types';

export const presets: Record<PresetName, PresetDefinition> = {
  minimal: {
    name: 'minimal',
    label: 'Minimal',
    description: 'Core only - React, TanStack Start, TypeScript, Tailwind, Biome',
    features: {
      tanstackQuery: false,
      apiClient: false,
      testing: false,
      githubActions: false,
    },
  },
  standard: {
    name: 'standard',
    label: 'Standard',
    description: 'Recommended - Includes data fetching, API client, and unit tests',
    features: {
      tanstackQuery: true,
      apiClient: true,
      testing: true,
      githubActions: false,
    },
  },
  enterprise: {
    name: 'enterprise',
    label: 'Enterprise',
    description: 'Full-featured - Includes unit tests and CI',
    features: {
      tanstackQuery: true,
      apiClient: true,
      testing: true,
      githubActions: true,
    },
  },
  custom: {
    name: 'custom',
    label: 'Custom',
    description: 'Choose your own features',
    features: {
      tanstackQuery: true,
      apiClient: true,
      testing: true,
      githubActions: false,
    },
  },
};

export function getPresetFeatures(presetName: PresetName): FeatureSet {
  return { ...presets[presetName].features };
}

export function getPresetList(): PresetDefinition[] {
  return Object.values(presets);
}
