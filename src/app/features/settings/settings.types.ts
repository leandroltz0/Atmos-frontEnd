export type ThemeMode = 'dark' | 'light';

export type SettingsItem = {
  id: string;
  label: string;
  description: string;
} & (
  | { type: 'toggle'; value: boolean }
  | { type: 'select'; value: string; options: { value: string; label: string }[] }
  | { type: 'action'; actionLabel: string }
);

export type SettingsGroup = {
  id: string;
  label: string;
  icon: string;
  items: SettingsItem[];
};
