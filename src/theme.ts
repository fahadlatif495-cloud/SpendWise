import type { TextStyle, ViewStyle } from 'react-native';

// SpendWise design tokens. Screens should use these instead of raw colors or sizes.

export const colors = {
  primary: '#3730A3',
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
  categories: {
    food: '#F97316',
    transport: '#3B82F6',
    bills: '#8B5CF6',
    shopping: '#EC4899',
    entertainment: '#06B6D4',
    other: '#6B7280',
  },
  // Light fills behind category icons. The spec asks for a tint and does not list hex values.
  categoryTints: {
    food: '#FFEDD5',
    transport: '#DBEAFE',
    bills: '#EDE9FE',
    shopping: '#FCE7F3',
    entertainment: '#CFFAFE',
    other: '#F3F4F6',
  },
} as const;

export type CategoryKey = keyof typeof colors.categories;

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
