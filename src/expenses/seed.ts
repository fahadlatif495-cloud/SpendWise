import type { AccountId } from '@/expenses/accounts';

export type MoneyKind = 'expense' | 'income';

export type Expense = {
  id: string;
  title: string;
  category: string;
  dateISO: string;
  amount: number;
  kind?: MoneyKind;
  account?: AccountId;
  repeatMonthly?: boolean;
  remind?: boolean;
  seriesId?: string;
  receiptUri?: string;
};

export const SEED_EXPENSES: Expense[] = [
  { id: '9', title: 'Breakfast', category: 'food', dateISO: '2026-10-30', amount: 450, account: 'cash' },
  { id: '10', title: 'Petrol', category: 'transport', dateISO: '2026-10-29', amount: 3000, account: 'jazzcash' },
  { id: '1', title: 'Grocery Run', category: 'food', dateISO: '2026-10-28', amount: 2450, account: 'cash' },
  { id: '2', title: 'Careem Ride', category: 'transport', dateISO: '2026-10-27', amount: 680, account: 'cash' },
  { id: '3', title: 'K-Electric Bill', category: 'bills', dateISO: '2026-10-26', amount: 8200, account: 'bank' },
  { id: '4', title: 'Outfitters', category: 'shopping', dateISO: '2026-10-25', amount: 3150, account: 'bank' },
  { id: '5', title: 'Netflix', category: 'entertainment', dateISO: '2026-10-24', amount: 1100, account: 'jazzcash', repeatMonthly: true, seriesId: '5' },
  { id: '6', title: 'Pharmacy', category: 'other', dateISO: '2026-10-22', amount: 540, account: 'cash' },
  { id: '8', title: 'House Rent', category: 'bills', dateISO: '2026-10-01', amount: 25000, account: 'bank', repeatMonthly: true, seriesId: '8' },
  { id: '7', title: 'Salary', category: 'other', dateISO: '2026-10-01', amount: 85000, kind: 'income', account: 'bank' },
];
