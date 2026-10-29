import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { currentMonthKey } from '@/expenses/format';
import { SEED_EXPENSES, type Expense } from '@/expenses/seed';

const STORAGE_KEY = 'spendwise.expenses';

type NewExpense = Omit<Expense, 'id'>;

type ExpenseContextValue = {
  expenses: Expense[];
  totalThisMonth: number;
  addExpense: (expense: NewExpense) => void;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Expense;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.category === 'string' &&
    typeof item.dateISO === 'string' &&
    typeof item.amount === 'number'
  );
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) {
          return;
        }

        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          return;
        }

        const saved = parsed.filter(isExpense);
        if (saved.length > 0) {
          setExpenses(saved);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)).catch(() => {});
  }, [expenses, ready]);

  const addExpense = useCallback((expense: NewExpense) => {
    setExpenses((current) => [{ ...expense, id: `${Date.now()}` }, ...current]);
  }, []);

  const totalThisMonth = useMemo(() => {
    const month = currentMonthKey();
    return expenses.reduce((sum, item) => {
      if (!item.dateISO.startsWith(month)) {
        return sum;
      }
      return sum + item.amount;
    }, 0);
  }, [expenses]);

  const value = useMemo(
    () => ({ expenses, totalThisMonth, addExpense }),
    [addExpense, expenses, totalThisMonth],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenses() {
  const value = useContext(ExpenseContext);
  if (!value) {
    throw new Error('useExpenses must be used inside ExpenseProvider');
  }
  return value;
}
