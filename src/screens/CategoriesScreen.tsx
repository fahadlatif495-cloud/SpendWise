import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { type CategoryKey, colors, radius, shadows, sizes, spacing, type } from '@/theme';

// Bar widths and colors are placeholder visuals. Nothing is calculated from the budget text.
// Warning at 80%+, danger at 100%+.

type CategoryCard = {
  id: CategoryKey;
  name: string;
  budget: string;
};

const CATEGORY_ROWS: CategoryCard[][] = [
  [
    { id: 'food', name: 'Food', budget: 'PKR 8,400 / 12,000' },
    { id: 'transport', name: 'Transport', budget: 'PKR 6,800 / 8,000' },
  ],
  [
    { id: 'bills', name: 'Bills', budget: 'PKR 15,200 / 15,000' },
    { id: 'shopping', name: 'Shopping', budget: 'PKR 4,200 / 10,000' },
  ],
  [
    { id: 'entertainment', name: 'Entertainment', budget: 'PKR 3,100 / 5,000' },
    { id: 'other', name: 'Other', budget: 'PKR 1,800 / 4,000' },
  ],
];

export default function CategoriesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Add category">
            <Text style={styles.addCategory}>Add Category</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {CATEGORY_ROWS.map((row) => (
            <View key={row[0].id} style={styles.row}>
              {row.map((category) => (
                <View key={category.id} style={styles.card}>
                  <CategoryIcon category={category.id} />
                  <Text style={styles.name}>{category.name}</Text>
                  <Text style={styles.budget}>{category.budget}</Text>
                  <View style={styles.track}>
                    <View style={[styles.fill, fillStyles[category.id]]} />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
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

const fillStyles = StyleSheet.create({
  food: {
    width: '70%',
    backgroundColor: colors.categories.food,
  },
  transport: {
    width: '85%',
    backgroundColor: colors.warning,
  },
  bills: {
    width: '100%',
    backgroundColor: colors.danger,
  },
  shopping: {
    width: '42%',
    backgroundColor: colors.categories.shopping,
  },
  entertainment: {
    width: '62%',
    backgroundColor: colors.categories.entertainment,
  },
  other: {
    width: '45%',
    backgroundColor: colors.categories.other,
  },
});
