import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { currentMonthKey } from '@/expenses/format';
import { colors } from '@/theme';

export type CategoryIconName = ComponentProps<typeof Ionicons>['name'];

export type Category = {
  id: string;
  name: string;
  budget: number;
  color: string;
  tint: string;
  icon: CategoryIconName;
};

export const CATEGORY_SWATCHES: { color: string; tint: string }[] = [
  { color: colors.categories.food, tint: colors.categoryTints.food },
  { color: colors.categories.transport, tint: colors.categoryTints.transport },
  { color: colors.categories.bills, tint: colors.categoryTints.bills },
  { color: colors.categories.shopping, tint: colors.categoryTints.shopping },
  { color: colors.categories.entertainment, tint: colors.categoryTints.entertainment },
  { color: colors.categories.other, tint: colors.categoryTints.other },
  { color: colors.primary, tint: colors.primaryTint },
  { color: colors.success, tint: '#DCFCE7' },
];

export const CATEGORY_ICON_CHOICES: CategoryIconName[] = [
  'restaurant',
  'car',
  'receipt',
  'bag-handle',
  'film',
  'home',
  'cafe',
  'medkit',
  'airplane',
  'gift',
  'fitness',
  'ellipsis-horizontal',
];

export const SEED_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', budget: 12000, color: colors.categories.food, tint: colors.categoryTints.food, icon: 'restaurant' },
  { id: 'transport', name: 'Transport', budget: 8000, color: colors.categories.transport, tint: colors.categoryTints.transport, icon: 'car' },
  { id: 'bills', name: 'Bills', budget: 15000, color: colors.categories.bills, tint: colors.categoryTints.bills, icon: 'receipt' },
  { id: 'shopping', name: 'Shopping', budget: 10000, color: colors.categories.shopping, tint: colors.categoryTints.shopping, icon: 'bag-handle' },
  { id: 'entertainment', name: 'Entertainment', budget: 5000, color: colors.categories.entertainment, tint: colors.categoryTints.entertainment, icon: 'film' },
  { id: 'other', name: 'Other', budget: 4000, color: colors.categories.other, tint: colors.categoryTints.other, icon: 'ellipsis-horizontal' },
];

export function categoryName(categories: Category[], id: string) {
  return categories.find((item) => item.id === id)?.name ?? 'Expense';
}

export function spentThisMonth(
  expenses: { category: string; dateISO: string; amount: number; kind?: string }[],
  categoryId: string,
) {
  const month = currentMonthKey();
  return expenses.reduce((sum, item) => {
    if (item.kind === 'income' || item.category !== categoryId || !item.dateISO.startsWith(month)) {
      return sum;
    }
    return sum + item.amount;
  }, 0);
}

/** 0–100. Over budget stays full. A zero budget with any spend is treated as full. */
export function budgetPercent(spent: number, budget: number) {
  if (budget <= 0) {
    return spent > 0 ? 100 : 0;
  }
  return Math.min(100, Math.round((spent / budget) * 100));
}

export function budgetFillColor(percent: number, categoryColor: string) {
  if (percent >= 100) {
    return colors.danger;
  }
  if (percent >= 80) {
    return colors.warning;
  }
  return categoryColor;
}
