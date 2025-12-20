export type PresetName = 'minimal' | 'standard' | 'enterprise' | 'custom';

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
  apiClient: boolean;
  testing: boolean;
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
