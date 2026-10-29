import type { CategoryKey } from '@/theme';

export type Expense = {
  id: string;
  title: string;
  category: CategoryKey;
  dateISO: string;
  amount: number;
};

export const SEED_EXPENSES: Expense[] = [
  { id: '1', title: 'Grocery Run', category: 'food', dateISO: '2026-10-28', amount: 2450 },
  { id: '2', title: 'Careem Ride', category: 'transport', dateISO: '2026-10-27', amount: 680 },
  { id: '3', title: 'K-Electric Bill', category: 'bills', dateISO: '2026-10-26', amount: 8200 },
  { id: '4', title: 'Outfitters', category: 'shopping', dateISO: '2026-10-25', amount: 3150 },
  { id: '5', title: 'Netflix', category: 'entertainment', dateISO: '2026-10-24', amount: 1100 },
  { id: '6', title: 'Pharmacy', category: 'other', dateISO: '2026-10-22', amount: 540 },
];
