export type PresetName = 'minimal' | 'standard' | 'enterprise' | 'custom';

export type FormLibrary = 'tanstack-form' | 'react-hook-form' | 'none';

export type TestingOption = 'none' | 'unit' | 'unit-e2e';

export type StateOption = 'none' | 'zustand';

export type UIBundle = 'core' | 'forms' | 'data-display' | 'overlays' | 'full';

export type ThemeColor =
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'teal'
  | 'green'
  | 'cyan'
  | 'peach'
  | 'black';

export interface ProjectConfig {
  name: string;
  preset: PresetName;
  features: FeatureSet;
  theme: ThemeColor;
}

export interface FeatureSet {
  tanstackQuery: boolean;
  forms: FormLibrary;
  apiClient: boolean;
  envValidation: boolean;
  testing: TestingOption;
  auth: boolean;
  state: StateOption;
  errorBoundaries: boolean;
  uiBundles: UIBundle[];
  githubActions: boolean;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  templatePath: string | null;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  files: string[];
}

export interface PresetDefinition {
  name: PresetName;
  label: string;
  description: string;
  features: FeatureSet;
}
