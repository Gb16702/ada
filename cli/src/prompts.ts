import { existsSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getPresetFeatures, getPresetList } from './presets';
import type {
    FeatureSet,
    FormLibrary,
    PresetName,
    ProjectConfig,
    StateOption,
    TestingOption,
    ThemeColor,
    UIBundle,
} from './types';
import { THEME_OPTIONS } from './utils/theme';

function directoryExists(name: string): boolean {
  const targetPath = join(process.cwd(), name);
  return existsSync(targetPath);
}

export async function runPrompts(
  projectName?: string,
  presetArg?: string,
  themeArg?: string,
  skipConfirm?: boolean
): Promise<ProjectConfig | null> {
  p.intro(pc.bgCyan(pc.black(' create-ada ')));

  let name: string | symbol;
  if (projectName) {
    if (directoryExists(projectName)) {
      p.log.error(`Directory "${projectName}" already exists`);
      return null;
    }
    name = projectName;
  } else {
    name = await promptProjectName();
    if (p.isCancel(name)) {
      p.cancel('Operation cancelled.');
      return null;
    }
  }

  const presetName = presetArg as PresetName | undefined;
  const validPresets: PresetName[] = ['minimal', 'standard', 'enterprise', 'custom'];

  let preset: PresetName;
  if (presetName && validPresets.includes(presetName)) {
    preset = presetName;
    p.log.info(`Using preset: ${pc.cyan(preset)}`);
  } else {
    const selectedPreset = await promptPreset();
    if (p.isCancel(selectedPreset)) {
      p.cancel('Operation cancelled.');
      return null;
    }
    preset = selectedPreset;
  }

  let features: FeatureSet;
  if (preset === 'custom') {
    const customFeatures = await promptCustomFeatures();
    if (!customFeatures) {
      return null;
    }
    features = customFeatures;
  } else {
    features = getPresetFeatures(preset);
  }

  const validThemes: ThemeColor[] = ['blue', 'indigo', 'purple', 'pink', 'teal', 'green', 'cyan', 'peach', 'black'];
  let theme: ThemeColor;
  if (themeArg && validThemes.includes(themeArg as ThemeColor)) {
    theme = themeArg as ThemeColor;
    p.log.info(`Using theme: ${pc.cyan(theme)}`);
  } else {
    const selectedTheme = await promptTheme();
    if (p.isCancel(selectedTheme)) {
      p.cancel('Operation cancelled.');
      return null;
    }
    theme = selectedTheme;
  }

  if (!skipConfirm) {
    const confirmed = await confirmConfig(name, preset, features, theme);
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel('Operation cancelled.');
      return null;
    }
  }

  return { name, preset, features, theme };
}

async function promptProjectName(): Promise<string | symbol> {
  return p.text({
    message: 'Project name:',
    placeholder: 'my-project',
    validate: (value) => {
      if (!value) {
        return 'Project name is required';
      }
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Project name must be lowercase with dashes only';
      }
      if (directoryExists(value)) {
        return `Directory "${value}" already exists`;
      }
      return undefined;
    },
  });
}

async function promptPreset(): Promise<PresetName | symbol> {
  const presetList = getPresetList();

  return p.select({
    message: 'Select a preset:',
    options: presetList.map((preset) => ({
      value: preset.name,
      label: preset.label,
      hint: preset.description,
    })),
    initialValue: 'standard' as PresetName,
  });
}

async function promptTheme(): Promise<ThemeColor | symbol> {
  return p.select({
    message: 'Theme color:',
    options: THEME_OPTIONS,
    initialValue: 'blue' as ThemeColor,
  });
}

async function promptCustomFeatures(): Promise<FeatureSet | null> {
  const forms = await p.select({
    message: 'Forms library:',
    options: [
      {
        value: 'tanstack-form' as const,
        label: 'TanStack Form',
        hint: 'Recommended - Type-safe, headless',
      },
      {
        value: 'react-hook-form' as const,
        label: 'React Hook Form',
        hint: 'Performant, widely used',
      },
      { value: 'none' as const, label: 'None', hint: 'No form library' },
    ],
    initialValue: 'tanstack-form' as FormLibrary,
  });

  if (p.isCancel(forms)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const testing = await p.select({
    message: 'Testing:',
    options: [
      { value: 'none' as const, label: 'None', hint: 'No testing setup' },
      {
        value: 'unit' as const,
        label: 'Unit tests',
        hint: 'Bun test + Testing Library',
      },
      {
        value: 'unit-e2e' as const,
        label: 'Unit + E2E',
        hint: 'Unit tests + Playwright',
      },
    ],
    initialValue: 'unit' as TestingOption,
  });

  if (p.isCancel(testing)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const state = await p.select({
    message: 'Global state management:',
    options: [
      {
        value: 'none' as const,
        label: 'None',
        hint: 'Use React context or TanStack Query',
      },
      { value: 'zustand' as const, label: 'Zustand', hint: 'Lightweight, flexible' },
    ],
    initialValue: 'none' as StateOption,
  });

  if (p.isCancel(state)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const uiBundles = await p.multiselect({
    message: 'UI component bundles:',
    options: [
      {
        value: 'core' as const,
        label: 'Core only',
        hint: 'Button, Input, Label, Toast',
      },
      {
        value: 'forms' as const,
        label: 'Forms',
        hint: 'Select, Checkbox, Radio, Switch',
      },
      {
        value: 'data-display' as const,
        label: 'Data display',
        hint: 'Table, Badge, Avatar',
      },
      {
        value: 'overlays' as const,
        label: 'Overlays',
        hint: 'Dialog, Sheet, Dropdown',
      },
      { value: 'full' as const, label: 'Full UI kit', hint: 'All components' },
    ],
    initialValues: ['core'],
    required: true,
  });

  if (p.isCancel(uiBundles)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const includeAuth = await p.confirm({
    message: 'Include auth skeleton (Better Auth)?',
    initialValue: false,
  });

  if (p.isCancel(includeAuth)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const includeErrorBoundaries = await p.confirm({
    message: 'Include error boundaries?',
    initialValue: false,
  });

  if (p.isCancel(includeErrorBoundaries)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const includeGithubActions = await p.confirm({
    message: 'Include GitHub Actions CI?',
    initialValue: false,
  });

  if (p.isCancel(includeGithubActions)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  return {
    tanstackQuery: true,
    forms: forms as FormLibrary,
    apiClient: true,
    testing: testing as TestingOption,
    auth: includeAuth,
    state: state as StateOption,
    errorBoundaries: includeErrorBoundaries,
    uiBundles: uiBundles as UIBundle[],
    githubActions: includeGithubActions,
  };
}

async function confirmConfig(
  name: string,
  preset: PresetName,
  features: FeatureSet,
  theme: ThemeColor
): Promise<boolean | symbol> {
  p.log.message(pc.dim('─'.repeat(50)));
  p.log.message(pc.bold('Project configuration:'));
  p.log.message(`  ${pc.cyan('Name:')} ${name}`);
  p.log.message(`  ${pc.cyan('Preset:')} ${preset}`);
  p.log.message(`  ${pc.cyan('Theme:')} ${theme}`);
  p.log.message('');
  p.log.message(pc.bold('Features:'));
  p.log.message(
    `  ${features.tanstackQuery ? pc.green('✓') : pc.dim('✗')} TanStack Query`
  );
  p.log.message(
    `  ${features.forms !== 'none' ? pc.green('✓') : pc.dim('✗')} Forms (${features.forms})`
  );
  p.log.message(
    `  ${features.apiClient ? pc.green('✓') : pc.dim('✗')} API Client`
  );
  p.log.message(`  ${pc.green('✓')} Env Validation ${pc.dim('(always enabled)')}`);
  p.log.message(
    `  ${features.testing !== 'none' ? pc.green('✓') : pc.dim('✗')} Testing (${features.testing})`
  );
  p.log.message(`  ${features.auth ? pc.green('✓') : pc.dim('✗')} Auth`);
  p.log.message(
    `  ${features.state !== 'none' ? pc.green('✓') : pc.dim('✗')} State (${features.state})`
  );
  p.log.message(
    `  ${features.errorBoundaries ? pc.green('✓') : pc.dim('✗')} Error Boundaries`
  );
  p.log.message(
    `  ${features.githubActions ? pc.green('✓') : pc.dim('✗')} GitHub Actions CI`
  );
  p.log.message(`  ${pc.cyan('UI Bundles:')} ${features.uiBundles.join(', ')}`);
  p.log.message(pc.dim('─'.repeat(50)));

  return p.confirm({
    message: 'Proceed with this configuration?',
    initialValue: true,
  });
}
