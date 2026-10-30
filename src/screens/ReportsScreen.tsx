import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors } from '@/components/ThemeProvider';
import { categoryName } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { formatMonthLabel, formatPkr } from '@/expenses/format';
import { type AppColors, radius, shadows, spacing, type } from '@/theme';

const PIE_HEIGHT = 200;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function createChartConfig(colors: AppColors) {
  return {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    fillShadowGradient: colors.primaryLight,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${colors.chartRgb}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${colors.chartLabelRgb}, ${opacity})`,
    barPercentage: 0.45,
    barRadius: 3,
    propsForBackgroundLines: {
      stroke: colors.border,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };
}

export default function ReportsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const chartConfig = useMemo(() => createChartConfig(colors), [colors]);
  const { expenses, categories } = useExpenses();
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(220, width - spacing.screen * 2 - spacing.card * 2);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const key = monthKey(cursor);
  const monthExpenses = expenses.filter((item) => item.kind !== 'income' && item.dateISO.startsWith(key));
  const spent = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const daily = Array.from({ length: days }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    return monthExpenses
      .filter((item) => item.dateISO.endsWith(`-${day}`))
      .reduce((sum, item) => sum + item.amount, 0);
  });
  const split = categories
    .map((item) => ({
      id: item.id,
      name: item.name,
      color: item.color,
      value: monthExpenses.filter((entry) => entry.category === item.id).reduce((sum, entry) => sum + entry.amount, 0),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
  const top = split[0];
  const pieData = split.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));
  const barData = {
    labels: daily.map((_, index) => {
      const day = index + 1;
      return day === 1 || day % 5 === 0 ? String(day) : '';
    }),
    datasets: [{ data: daily }],
  };

  function shiftMonth(delta: number) {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reports</Text>

        <View style={styles.monthRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            onPress={() => shiftMonth(-1)}
            style={styles.chevron}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.month}>{formatMonthLabel(cursor)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            onPress={() => shiftMonth(1)}
            style={styles.chevron}>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>{formatPkr(spent)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Top Category</Text>
            <Text style={styles.summaryValue}>{top ? categoryName(categories, top.id) : '—'}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Daily Avg</Text>
            <Text style={styles.summaryValue}>{formatPkr(spent / days)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          {pieData.length === 0 ? (
            <Text style={styles.empty}>No spending in this month</Text>
          ) : (
            <>
              <PieChart
                data={pieData}
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
                {split.map((item) => (
                  <View key={item.id} style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendName}>{item.name}</Text>
                    <Text style={styles.legendPercent}>
                      {spent > 0 ? `${Math.round((item.value / spent) * 100)}%` : '0%'}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Spending Trend</Text>
          {spent === 0 ? (
            <Text style={styles.empty}>No spending in this month</Text>
          ) : (
            <BarChart
              data={barData}
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
          )}
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
  empty: {
    ...type.body,
    color: colors.textSecondary,
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
}
