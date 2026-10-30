import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { useColors, useThemeChoice } from '@/components/ThemeProvider';
import { ACCOUNTS, accountName } from '@/expenses/accounts';
import { categoryName } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { currentMonthKey, formatExpenseDate, formatMonthLabel, formatPkr, parseAmount } from '@/expenses/format';
import { type AppColors, radius, shadows, sizes, spacing, type } from '@/theme';

export default function HomeScreen() {
  const colors = useColors();
  const { isDark, toggle } = useThemeChoice();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { expenses, categories, totalThisMonth, incomeThisMonth, monthlyBudget, setMonthlyBudget } =
    useExpenses();
  const [selected, setSelected] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetText, setBudgetText] = useState('');
  const month = currentMonthKey();
  const query = search.trim().toLowerCase();
  const visible = expenses.filter((item) => {
    if (selected && item.category !== selected) {
      return false;
    }
    if (account && (item.account ?? 'cash') !== account) {
      return false;
    }
    if (!query) {
      return true;
    }
    const haystack = `${item.title} ${categoryName(categories, item.category)} ${item.amount} ${accountName(item.account)}`.toLowerCase();
    return haystack.includes(query);
  });
  const filteredSpend = visible.reduce((sum, item) => {
    if (item.kind === 'income' || !item.dateISO.startsWith(month)) {
      return sum;
    }
    return sum + item.amount;
  }, 0);
  const shownTotal = selected || account || query ? filteredSpend : totalThisMonth;
  const totalLabel = selected
    ? `${categoryName(categories, selected)} This Month`
    : account
      ? `${accountName(account)} This Month`
      : 'Total Spent This Month';
  const budgetUsed = monthlyBudget > 0 ? totalThisMonth / monthlyBudget : 0;
  const nearBudget = budgetUsed >= 0.8;

  function saveBudget() {
    const amount = parseAmount(budgetText);
    if (amount == null) {
      return;
    }
    setMonthlyBudget(amount);
    setBudgetOpen(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appName}>SpendWise</Text>
          <View style={styles.headerSide}>
            <Text style={styles.month}>{formatMonthLabel()}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              onPress={toggle}
              style={styles.themeButton}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={sizes.smallIcon} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{totalLabel}</Text>
          <Text style={styles.totalAmount}>{formatPkr(shownTotal)}</Text>
          <Text style={styles.incomeLine}>Income {formatPkr(incomeThisMonth)}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setBudgetText(monthlyBudget > 0 ? String(monthlyBudget) : '');
              setBudgetOpen(true);
            }}>
            <Text style={styles.budgetLine}>
              {monthlyBudget > 0
                ? `Month budget ${formatPkr(monthlyBudget)}`
                : 'Set a monthly budget'}
            </Text>
          </Pressable>
        </View>

        {nearBudget ? (
          <View style={budgetUsed >= 1 ? styles.alertDanger : styles.alertWarn}>
            <Text style={styles.alertText}>
              {budgetUsed >= 1 ? 'You are over this month’s budget.' : 'You are near this month’s budget.'}
            </Text>
          </View>
        ) : null}

        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search note or amount"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          keyboardAppearance={isDark ? 'dark' : 'light'}
        />

        <View style={styles.accountRow}>
          {ACCOUNTS.map((item) => {
            const active = account === item.id;
            const spent = expenses.reduce((sum, entry) => {
              if (entry.kind === 'income' || (entry.account ?? 'cash') !== item.id || !entry.dateISO.startsWith(month)) {
                return sum;
              }
              return sum + entry.amount;
            }, 0);
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setAccount(active ? null : item.id)}
                style={active ? [styles.accountCard, styles.accountSelected] : styles.accountCard}>
                <Text style={styles.accountName}>{item.name}</Text>
                <Text style={styles.accountAmount}>{formatPkr(spent)}</Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected == null }}
            onPress={() => setSelected(null)}
            style={selected == null ? [styles.chip, styles.chipSelected] : styles.chip}>
            <Text style={styles.chipLabel}>All</Text>
          </Pressable>
          {categories.map((category) => {
            const active = selected === category.id;
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setSelected(active ? null : category.id)}
                style={active ? [styles.chip, styles.chipSelected] : styles.chip}>
                <CategoryIcon category={category.id} boxed={false} />
                <Text style={styles.chipLabel}>{category.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {visible.length === 0 ? (
          <Text style={styles.empty}>
            {selected ? `No ${categoryName(categories, selected)} expenses yet` : 'No expenses yet'}
          </Text>
        ) : (
          visible.map((item, index) => (
            <View key={item.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => router.push({ pathname: '/expense/[id]', params: { id: item.id } })}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                <CategoryIcon category={item.category} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowDate}>{formatExpenseDate(item.dateISO)}</Text>
                </View>
                <Text style={item.kind === 'income' ? styles.rowIncome : styles.rowAmount}>
                  {formatPkr(item.amount)}
                </Text>
              </Pressable>
              {index < visible.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add expense"
        onPress={() => router.push('/add')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
        <Ionicons name="add" size={sizes.navIcon} color={colors.white} />
      </Pressable>

      {budgetOpen ? (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Monthly budget</Text>
            <TextInput
              style={styles.modalInput}
              value={budgetText}
              onChangeText={setBudgetText}
              placeholder="PKR 50,000"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              selectionColor={colors.primary}
              keyboardAppearance={isDark ? 'dark' : 'light'}
            />
            <Pressable accessibilityRole="button" onPress={saveBudget} style={styles.modalSave}>
              <Text style={styles.modalSaveText}>Save Budget</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setBudgetOpen(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.section,
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appName: {
    ...type.screenTitle,
    color: colors.textPrimary,
  },
  month: {
    ...type.body,
    color: colors.textSecondary,
  },
  totalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.card,
    marginBottom: spacing.section,
    ...shadows.card,
  },
  totalLabel: {
    ...type.secondary,
    color: colors.textSecondary,
  },
  totalAmount: {
    ...type.appTitle,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  incomeLine: {
    ...type.secondary,
    color: colors.success,
    marginTop: spacing.xs,
  },
  budgetLine: {
    ...type.secondary,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  alertWarn: {
    backgroundColor: colors.warningTint,
    borderRadius: radius.input,
    padding: spacing.gap,
    marginBottom: spacing.gap,
  },
  alertDanger: {
    backgroundColor: colors.dangerTint,
    borderRadius: radius.input,
    padding: spacing.gap,
    marginBottom: spacing.gap,
  },
  alertText: {
    ...type.body,
    color: colors.textPrimary,
  },
  search: {
    height: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.gap,
    ...type.body,
    color: colors.textPrimary,
  },
  accountRow: {
    flexDirection: 'row',
    gap: spacing.gap,
    marginBottom: spacing.section,
  },
  accountCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.summary,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gap,
  },
  accountSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  accountName: {
    ...type.secondary,
    color: colors.textSecondary,
  },
  accountAmount: {
    ...type.chip,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  chipScroll: {
    flexGrow: 0,
    marginBottom: spacing.section,
  },
  chipRow: {
    gap: spacing.gap,
  },
  chip: {
    height: sizes.chip,
    borderRadius: radius.chip,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.gap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  chipLabel: {
    ...type.chip,
    color: colors.textPrimary,
  },
  sectionTitle: {
    ...type.section,
    color: colors.textPrimary,
    marginBottom: spacing.gap,
  },
  empty: {
    ...type.body,
    color: colors.textSecondary,
  },
  row: {
    minHeight: sizes.listItem,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    ...type.body,
    color: colors.textPrimary,
  },
  rowDate: {
    ...type.secondary,
    color: colors.textSecondary,
  },
  rowAmount: {
    ...type.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rowIncome: {
    ...type.body,
    fontWeight: '600',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  fab: {
    position: 'absolute',
    right: spacing.section,
    bottom: spacing.section,
    width: sizes.fab,
    height: sizes.fab,
    borderRadius: sizes.fab / 2,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  fabPressed: {
    opacity: 0.9,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screen,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.card,
    ...shadows.card,
  },
  modalTitle: {
    ...type.section,
    color: colors.textPrimary,
    marginBottom: spacing.gap,
  },
  modalInput: {
    height: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.screen,
    ...type.body,
    color: colors.textPrimary,
  },
  modalSave: {
    height: sizes.button,
    borderRadius: radius.button,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.gap,
  },
  modalSaveText: {
    ...type.button,
    color: colors.white,
  },
  modalCancel: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.gap,
  },
});
}
