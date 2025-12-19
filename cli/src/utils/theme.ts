import type { ThemeColor } from '../types';

/**
 * Theme configuration for CLI prompts.
 * Actual theme CSS is in templates/base/src/theme.css (static, not generated).
 */

export const THEME_OPTIONS: { value: ThemeColor; label: string; hint?: string }[] = [
  { value: 'black', label: 'Black', hint: 'Neutral, professional' },
  { value: 'blue', label: 'Blue', hint: 'Default' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'green', label: 'Green' },
  { value: 'peach', label: 'Peach' },
];

export const THEME_COLORS = THEME_OPTIONS.map(opt => opt.value);
