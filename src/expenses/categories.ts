import type { CategoryKey } from '@/theme';

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'bills', label: 'Bills' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'other', label: 'Other' },
];

export function categoryLabel(category: CategoryKey) {
  return CATEGORIES.find((item) => item.key === category)?.label ?? 'Expense';
}
