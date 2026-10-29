import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type CategoryKey, colors, radius, shadows, spacing, type } from '@/theme';

const MONTH = 'October 2026';

const SUMMARY = [
  { label: 'Total Spent', value: 'PKR 16,120' },
  { label: 'Top Category', value: 'Bills' },
  { label: 'Daily Avg', value: 'PKR 537' },
];

const CATEGORY_SPLIT: {
  key: CategoryKey;
  name: string;
  value: number;
  percent: string;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}[] = [
  {
    key: 'food',
    name: 'Food',
    value: 22,
    percent: '22%',
    color: colors.categories.food,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  },
  {
    key: 'transport',
    name: 'Transport',
    value: 14,
    percent: '14%',
    color: colors.categories.transport,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  },
  {
    key: 'bills',
    name: 'Bills',
    value: 35,
    percent: '35%',
    color: colors.categories.bills,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  },
  {
    key: 'shopping',
    name: 'Shopping',
    value: 15,
    percent: '15%',
    color: colors.categories.shopping,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  },
  {
    key: 'entertainment',
    name: 'Entertainment',
    value: 9,
    percent: '9%',
    color: colors.categories.entertainment,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  },
  {
    key: 'other',
    name: 'Other',
    value: 5,
    percent: '5%',
    color: colors.categories.other,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  },
];

const DAILY_LABELS = [
  '1',
  '',
  '',
  '',
  '5',
  '',
  '',
  '',
  '',
  '10',
  '',
  '',
  '',
  '',
  '15',
  '',
  '',
  '',
  '',
  '20',
  '',
  '',
  '',
  '',
  '25',
  '',
  '',
  '',
  '',
  '30',
];

const DAILY_VALUES = [
  420, 880, 310, 1500, 640, 220, 90, 1750, 430, 980, 120, 2600, 540, 310, 870, 190, 1420, 760, 80,
  2100, 450, 330, 690, 1540, 270, 410, 1890, 520, 960, 1100,
];

const DAILY_SPENDING = {
  labels: DAILY_LABELS,
  datasets: [{ data: DAILY_VALUES }],
};

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  fillShadowGradient: colors.primaryLight,
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  barPercentage: 0.45,
  barRadius: 3,
  propsForBackgroundLines: {
    stroke: colors.border,
  },
  propsForLabels: {
    fontSize: 10,
  },
};

const PIE_HEIGHT = 200;

export default function ReportsScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(220, width - spacing.screen * 2 - spacing.card * 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reports</Text>

        <View style={styles.monthRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            style={styles.chevron}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.month}>{MONTH}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Next month" style={styles.chevron}>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          {SUMMARY.map((item) => (
            <View key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          <PieChart
            data={CATEGORY_SPLIT}
            width={chartWidth}
            height={PIE_HEIGHT}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft={String(Math.round(chartWidth / 4))}
            chartConfig={chartConfig}
            hasLegend={false}
            style={styles.pie}
          />
          <View style={styles.legend}>
            {CATEGORY_SPLIT.map((item) => (
              <View key={item.key} style={styles.legendRow}>
                <View style={[styles.dot, dotStyles[item.key]]} />
                <Text style={styles.legendName}>{item.name}</Text>
                <Text style={styles.legendPercent}>{item.percent}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Spending Trend</Text>
          <BarChart
            data={DAILY_SPENDING}
            width={chartWidth}
            height={220}
            fromZero
            flatColor
            withInnerLines
            showBarTops={false}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.bar}
          />
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
  title: {
    ...type.screenTitle,
    color: colors.textPrimary,
    marginBottom: spacing.section,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.section,
  },
  chevron: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    ...type.section,
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.gap,
    marginBottom: spacing.section,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.summary,
    padding: spacing.gap,
    ...shadows.card,
  },
  summaryLabel: {
    ...type.secondary,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...type.section,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.card,
    marginBottom: spacing.section,
    ...shadows.card,
  },
  cardTitle: {
    ...type.section,
    color: colors.textPrimary,
    marginBottom: spacing.gap,
  },
  pie: {
    alignSelf: 'center',
  },
  legend: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    ...type.chip,
    flex: 1,
    color: colors.textPrimary,
  },
  legendPercent: {
    ...type.secondary,
    color: colors.textSecondary,
  },
  bar: {
    borderRadius: radius.input,
  },
});

const dotStyles = StyleSheet.create({
  food: { backgroundColor: colors.categories.food },
  transport: { backgroundColor: colors.categories.transport },
  bills: { backgroundColor: colors.categories.bills },
  shopping: { backgroundColor: colors.categories.shopping },
  entertainment: { backgroundColor: colors.categories.entertainment },
  other: { backgroundColor: colors.categories.other },
});
