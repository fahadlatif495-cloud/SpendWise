import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { SEED_CATEGORIES, type Category } from '@/expenses/categories';
import { currentMonthKey } from '@/expenses/format';
import { SEED_EXPENSES, type Expense } from '@/expenses/seed';

const EXPENSE_KEY = 'spendwise.expenses';
const CATEGORY_KEY = 'spendwise.categories';
const SETTINGS_KEY = 'spendwise.settings';

type NewExpense = Omit<Expense, 'id'>;
type NewCategory = Omit<Category, 'id'>;

type ExpenseContextValue = {
  expenses: Expense[];
  categories: Category[];
  totalThisMonth: number;
  incomeThisMonth: number;
  monthlyBudget: number;
  addExpense: (expense: NewExpense) => void;
  updateExpense: (id: string, expense: NewExpense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: NewCategory) => void;
  setMonthlyBudget: (amount: number) => void;
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

function isCategory(value: unknown): value is Category {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Category;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.budget === 'number' &&
    typeof item.color === 'string' &&
    typeof item.tint === 'string' &&
    typeof item.icon === 'string'
  );
}

function withStarterExpenses(items: Expense[], alreadyAdded: boolean) {
  if (alreadyAdded) {
    return items;
  }

  const ids = new Set(items.map((item) => item.id));
  const merged = [...items];
  for (const sample of SEED_EXPENSES) {
    if (!ids.has(sample.id)) {
      merged.push(sample);
    }
  }

  return merged.sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

function sumMonth(expenses: Expense[], kind: 'expense' | 'income') {
  const month = currentMonthKey();
  return expenses.reduce((sum, item) => {
    const itemKind = item.kind === 'income' ? 'income' : 'expense';
    if (itemKind !== kind || !item.dateISO.startsWith(month)) {
      return sum;
    }
    return sum + item.amount;
  }, 0);
}

function fillMonthlyRepeats(items: Expense[]) {
  const month = currentMonthKey();
  const latest = new Map<string, Expense>();

  for (const item of items) {
    if (!item.repeatMonthly) {
      continue;
    }
    const key = item.seriesId ?? item.id;
    const current = latest.get(key);
    if (!current || item.dateISO > current.dateISO) {
      latest.set(key, item);
    }
  }

  const copies: Expense[] = [];
  for (const [key, template] of latest) {
    const already = items.some(
      (item) => (item.seriesId ?? item.id) === key && item.dateISO.startsWith(month),
    );
    if (already) {
      continue;
    }

    const [yearText, monthText] = month.split('-');
    const year = Number(yearText);
    const monthNumber = Number(monthText);
    const wantedDay = Number(template.dateISO.slice(8, 10)) || 1;
    const lastDay = new Date(year, monthNumber, 0).getDate();
    const day = String(Math.min(wantedDay, lastDay)).padStart(2, '0');
    copies.push({
      ...template,
      id: `${key}-${month}`,
      seriesId: key,
      dateISO: `${month}-${day}`,
      repeatMonthly: true,
    });
  }

  return copies.length > 0 ? [...copies, ...items] : items;
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [monthlyBudget, setMonthlyBudgetState] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([
      AsyncStorage.getItem(EXPENSE_KEY),
      AsyncStorage.getItem(CATEGORY_KEY),
      AsyncStorage.getItem(SETTINGS_KEY),
    ])
      .then(([expenseRaw, categoryRaw, settingsRaw]) => {
        if (!active) {
          return;
        }

        let starterAdded = false;
        if (settingsRaw) {
          const parsed: unknown = JSON.parse(settingsRaw);
          if (parsed && typeof parsed === 'object') {
            const settings = parsed as { monthlyBudget?: unknown; starterAdded?: unknown };
            starterAdded = settings.starterAdded === true;
            if (typeof settings.monthlyBudget === 'number' && settings.monthlyBudget >= 0) {
              setMonthlyBudgetState(settings.monthlyBudget);
            }
          }
        }

        if (expenseRaw) {
          const parsed: unknown = JSON.parse(expenseRaw);
          if (Array.isArray(parsed)) {
            const saved = parsed.filter(isExpense);
            if (saved.length > 0) {
              setExpenses(fillMonthlyRepeats(withStarterExpenses(saved, starterAdded)));
            }
          }
        } else {
          setExpenses(fillMonthlyRepeats(SEED_EXPENSES));
        }

        if (categoryRaw) {
          const parsed: unknown = JSON.parse(categoryRaw);
          if (Array.isArray(parsed)) {
            const saved = parsed.filter(isCategory);
            if (saved.length > 0) {
              setCategories(saved);
            }
          }
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

    AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses)).catch(() => {});
    AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(categories)).catch(() => {});
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ monthlyBudget, starterAdded: true })).catch(() => {});
  }, [categories, expenses, monthlyBudget, ready]);

  const addExpense = useCallback((expense: NewExpense) => {
    const id = `${Date.now()}`;
    setExpenses((current) => [
      { ...expense, id, seriesId: expense.repeatMonthly ? id : expense.seriesId },
      ...current,
    ]);
  }, []);

  const updateExpense = useCallback((id: string, expense: NewExpense) => {
    setExpenses((current) =>
      current.map((item) => (item.id === id ? { ...item, ...expense, id } : item)),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((current) => current.filter((item) => item.id !== id));
  }, []);

  const addCategory = useCallback((category: NewCategory) => {
    const slug = category.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setCategories((current) => [...current, { ...category, id: `${slug || 'category'}-${Date.now()}` }]);
  }, []);

  const setMonthlyBudget = useCallback((amount: number) => {
    setMonthlyBudgetState(amount);
  }, []);

  const totalThisMonth = useMemo(() => sumMonth(expenses, 'expense'), [expenses]);
  const incomeThisMonth = useMemo(() => sumMonth(expenses, 'income'), [expenses]);

  const value = useMemo(
    () => ({
      expenses,
      categories,
      totalThisMonth,
      incomeThisMonth,
      monthlyBudget,
      addExpense,
      updateExpense,
      deleteExpense,
      addCategory,
      setMonthlyBudget,
    }),
    [
      addCategory,
      addExpense,
      categories,
      deleteExpense,
      expenses,
      incomeThisMonth,
      monthlyBudget,
      setMonthlyBudget,
      totalThisMonth,
      updateExpense,
    ],
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
