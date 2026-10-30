import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { useColors } from '@/components/ThemeProvider';
import { budgetFillColor, budgetPercent, spentThisMonth } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { formatExpenseDate, formatMonthLabel, formatPkr } from '@/expenses/format';
import { type AppColors, radius, shadows, sizes, spacing, type } from '@/theme';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.navigate('/categories');
  }
}

export default function CategoryDetailScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = Array.isArray(id) ? id[0] : id;
  const { categories, expenses } = useExpenses();
  const category = categories.find((item) => item.id === categoryId);
  const items = expenses.filter((item) => item.category === categoryId);
  const spent = category ? spentThisMonth(expenses, category.id) : 0;
  const percent = category ? budgetPercent(spent, category.budget) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={sizes.navIcon} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{category?.name ?? 'Category'}</Text>
      </View>

      {!category ? (
        <Text style={styles.missing}>This category is not available.</Text>
      ) : (
        <View style={styles.body}>
        <ScrollView style={styles.list} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <CategoryIcon category={category.id} />
            <Text style={styles.spentLabel}>Spent in {formatMonthLabel()}</Text>
            <Text style={styles.spent}>{formatPkr(spent)}</Text>
            <Text style={styles.budget}>of {formatPkr(category.budget)}</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${percent}%`,
                    backgroundColor: budgetFillColor(percent, category.color),
                  },
                ]}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Expenses</Text>
          {items.length === 0 ? (
            <Text style={styles.empty}>No expenses in this category yet</Text>
          ) : (
            items.map((item, index) => (
              <View key={item.id}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push({ pathname: '/expense/[id]', params: { id: item.id } })}
                  style={styles.row}>
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
                {index < items.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))
          )}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${category.name} expense`}
          onPress={() => router.push({ pathname: '/add', params: { category: category.id } })}
          style={({ pressed }) => [styles.addButton, pressed && styles.addPressed]}>
          <Text style={styles.addText}>Add Expense</Text>
        </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    gap: spacing.xs,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  title: {
    ...type.screenTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  missing: {
    ...type.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.screen,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.section,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.card,
    marginBottom: spacing.section,
    ...shadows.card,
  },
  spentLabel: {
    ...type.secondary,
    color: colors.textSecondary,
    marginTop: spacing.gap,
  },
  spent: {
    ...type.appTitle,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  budget: {
    ...type.secondary,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  track: {
    height: sizes.progress,
    borderRadius: radius.chip,
    backgroundColor: colors.border,
    marginTop: spacing.gap,
    overflow: 'hidden',
  },
  fill: {
    height: sizes.progress,
    borderRadius: radius.chip,
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
  rowIncome: {
    ...type.body,
    fontWeight: '600',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  addButton: {
    height: sizes.button,
    borderRadius: radius.button,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.screen,
  },
  addPressed: {
    opacity: 0.9,
  },
  addText: {
    ...type.button,
    color: colors.white,
  },
});
}
