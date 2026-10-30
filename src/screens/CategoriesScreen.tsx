import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { useColors } from '@/components/ThemeProvider';
import {
  budgetFillColor,
  budgetPercent,
  spentThisMonth,
  type Category,
} from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { formatPkr } from '@/expenses/format';
import { type AppColors, radius, shadows, sizes, spacing, type } from '@/theme';

function pairCategories(items: Category[]) {
  const rows: Category[][] = [];
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }
  return rows;
}

export default function CategoriesScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { categories, expenses } = useExpenses();
  const rows = pairCategories(categories);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add category"
            onPress={() => router.push('/add-category')}>
            <Text style={styles.addCategory}>Add Category</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {rows.map((row) => (
            <View key={row[0].id} style={styles.row}>
              {row.map((category) => {
                const spent = spentThisMonth(expenses, category.id);
                const percent = budgetPercent(spent, category.budget);
                return (
                  <Pressable
                    key={category.id}
                    accessibilityRole="button"
                    accessibilityLabel={category.name}
                    onPress={() =>
                      router.push({ pathname: '/category/[id]', params: { id: category.id } })
                    }
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
                    <CategoryIcon category={category.id} />
                    <Text style={styles.name}>{category.name}</Text>
                    <Text style={styles.budget}>
                      {formatPkr(spent)} / {category.budget.toLocaleString('en-US')}
                    </Text>
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
                  </Pressable>
                );
              })}
              {row.length === 1 ? <View style={styles.spacer} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: spacing.section,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.section,
  },
  title: {
    ...type.screenTitle,
    color: colors.textPrimary,
  },
  addCategory: {
    ...type.body,
    fontWeight: '600',
    color: colors.primary,
  },
  grid: {
    gap: spacing.gap,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.gap,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.card,
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.9,
  },
  spacer: {
    flex: 1,
  },
  name: {
    ...type.body,
    fontWeight: '600',
    color: colors.textPrimary,
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
});
}
