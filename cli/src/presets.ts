import type { FeatureSet, PresetDefinition, PresetName } from './types';

export const presets: Record<PresetName, PresetDefinition> = {
  minimal: {
    name: 'minimal',
    label: 'Minimal',
    description: 'Core only - React, TanStack Start, TypeScript, Tailwind, Biome',
    features: {
      tanstackQuery: false,
      forms: 'none',
      apiClient: false,
      testing: 'none',
      auth: false,
      state: 'none',
      errorBoundaries: false,
      uiBundles: ['core'],
      githubActions: false,
    },
  },
  standard: {
    name: 'standard',
    label: 'Standard',
    description: 'Recommended - Includes data fetching, forms, API client, and unit tests',
    features: {
      tanstackQuery: true,
      forms: 'tanstack-form',
      apiClient: true,
      testing: 'unit',
      auth: false,
      state: 'none',
      errorBoundaries: false,
      uiBundles: ['core'],
      githubActions: false,
    },
  },
  enterprise: {
    name: 'enterprise',
    label: 'Enterprise',
    description: 'Full-featured - Includes auth, state management, E2E tests, CI, and error handling',
    features: {
      tanstackQuery: true,
      forms: 'tanstack-form',
      apiClient: true,
      testing: 'unit-e2e',
      auth: true,
      state: 'zustand',
      errorBoundaries: true,
      uiBundles: ['core'],
      githubActions: true,
    },
  },
  custom: {
    name: 'custom',
    label: 'Custom',
    description: 'Choose your own features',
    features: {
      tanstackQuery: true,
      forms: 'tanstack-form',
      apiClient: true,
      testing: 'unit',
      auth: false,
      state: 'none',
      errorBoundaries: false,
      uiBundles: ['core'],
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
