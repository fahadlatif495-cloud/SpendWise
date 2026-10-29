import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { CATEGORIES, categoryLabel } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { currentMonthKey, formatExpenseDate, formatMonthLabel, formatPkr } from '@/expenses/format';
import { type CategoryKey, colors, radius, shadows, sizes, spacing, type } from '@/theme';

export default function HomeScreen() {
  const { expenses, totalThisMonth } = useExpenses();
  const [selected, setSelected] = useState<CategoryKey | null>(null);
  const visible = selected ? expenses.filter((item) => item.category === selected) : expenses;
  const month = currentMonthKey();
  const shownTotal = selected
    ? expenses.reduce((sum, item) => {
        if (item.category !== selected || !item.dateISO.startsWith(month)) {
          return sum;
        }
        return sum + item.amount;
      }, 0)
    : totalThisMonth;
  const totalLabel = selected ? `${categoryLabel(selected)} This Month` : 'Total Spent This Month';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appName}>SpendWise</Text>
          <Text style={styles.month}>{formatMonthLabel()}</Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{totalLabel}</Text>
          <Text style={styles.totalAmount}>{formatPkr(shownTotal)}</Text>
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
          {CATEGORIES.map((category) => {
            const active = selected === category.key;
            return (
              <Pressable
                key={category.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setSelected(active ? null : category.key)}
                style={active ? [styles.chip, styles.chipSelected] : styles.chip}>
                <CategoryIcon category={category.key} boxed={false} />
                <Text style={styles.chipLabel}>{category.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {visible.length === 0 ? (
          <Text style={styles.empty}>
            {selected ? `No ${categoryLabel(selected)} expenses yet` : 'No expenses yet'}
          </Text>
        ) : (
          visible.map((item, index) => (
            <View key={item.id}>
              <View style={styles.row}>
                <CategoryIcon category={item.category} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowDate}>{formatExpenseDate(item.dateISO)}</Text>
                </View>
                <Text style={styles.rowAmount}>{formatPkr(item.amount)}</Text>
              </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  fabPressed: {
    opacity: 0.9,
  },
});
