import type { ThemeColor } from '../types';

export const THEME_OPTIONS: { value: ThemeColor; label: string; hint?: string }[] = [
  { value: 'blue', label: 'Blue', hint: 'Default' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'green', label: 'Green' },
  { value: 'peach', label: 'Peach' },
  { value: 'black', label: 'Black', hint: 'Monochrome' },
];

export function generateActionColors(theme: ThemeColor): string {
  if (theme === 'black') {
    return `:root {
  --action: var(--color-ds-gray-1000);
  --action-hover: var(--color-ds-gray-900);
}`;
  }

  return `:root {
  --action: var(--color-ds-${theme}-700);
  --action-hover: var(--color-ds-${theme}-800);
}`;
}
