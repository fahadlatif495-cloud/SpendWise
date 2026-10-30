import type { TextStyle, ViewStyle } from 'react-native';

// SpendWise design tokens. Screens should use these instead of raw colors or sizes.

const categoryColors = {
  food: '#F97316',
  transport: '#3B82F6',
  bills: '#8B5CF6',
  shopping: '#EC4899',
  entertainment: '#06B6D4',
  other: '#6B7280',
} as const;

export type AppColors = {
  primary: string;
  primaryButton: string;
  primaryLight: string;
  primaryTint: string;
  background: string;
  surface: string;
  white: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  warningTint: string;
  dangerTint: string;
  overlay: string;
  chartRgb: string;
  chartLabelRgb: string;
  categories: typeof categoryColors;
  categoryTints: {
    food: string;
    transport: string;
    bills: string;
    shopping: string;
    entertainment: string;
    other: string;
  };
};

export const lightColors: AppColors = {
  primary: '#3730A3',
  primaryButton: '#3730A3',
  primaryLight: '#6366F1',
  primaryTint: '#EEF2FF',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  warningTint: '#FEF3C7',
  dangerTint: '#FEE2E2',
  overlay: 'rgba(31, 41, 55, 0.4)',
  chartRgb: '99, 102, 241',
  chartLabelRgb: '107, 114, 128',
  categories: categoryColors,
  categoryTints: {
    food: '#FFEDD5',
    transport: '#DBEAFE',
    bills: '#EDE9FE',
    shopping: '#FCE7F3',
    entertainment: '#CFFAFE',
    other: '#F3F4F6',
  },
};

export const darkColors: AppColors = {
  primary: '#A5B4FC',
  primaryButton: '#4F46E5',
  primaryLight: '#818CF8',
  primaryTint: '#312E81',
  background: '#0F172A',
  surface: '#1E293B',
  white: '#FFFFFF',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#334155',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  warningTint: '#451A03',
  dangerTint: '#450A0A',
  overlay: 'rgba(0, 0, 0, 0.65)',
  chartRgb: '165, 180, 252',
  chartLabelRgb: '203, 213, 225',
  categories: categoryColors,
  categoryTints: {
    food: '#7C2D12',
    transport: '#1E3A8A',
    bills: '#4C1D95',
    shopping: '#831843',
    entertainment: '#164E63',
    other: '#334155',
  },
};

/** Light palette for saved category colors. Screens use useColors() so they can switch. */
export const colors = lightColors;

export type CategoryKey = keyof typeof categoryColors;

export const spacing = {
  xs: 8,
  screen: 16,
  card: 16,
  gap: 12,
  section: 24,
} as const;

export const radius = {
  card: 16,
  button: 12,
  chip: 20,
  input: 12,
  icon: 12,
  summary: 12,
} as const;

export const type = {
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 44.8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19.6,
  },
  secondary: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
  },
  chip: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16.8,
  },
} as const satisfies Record<string, TextStyle>;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const satisfies Record<string, ViewStyle>;

export const sizes = {
  tabBar: 64,
  fab: 56,
  input: 48,
  button: 52,
  chip: 36,
  listItem: 64,
  categoryIcon: 24,
  categoryIconBox: 44,
  navIcon: 24,
  smallIcon: 16,
  progress: 6,
} as const;
