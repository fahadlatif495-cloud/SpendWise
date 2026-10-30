import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { useColors } from '@/components/ThemeProvider';
import { accountName } from '@/expenses/accounts';
import { categoryName } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { formatExpenseDate, formatPkr } from '@/expenses/format';
import { type AppColors, radius, shadows, sizes, spacing, type } from '@/theme';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.navigate('/');
  }
}

export default function ExpenseDetailScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenseId = Array.isArray(id) ? id[0] : id;
  const { expenses, categories, deleteExpense } = useExpenses();
  const expense = expenses.find((item) => item.id === expenseId);
  const name = expense ? categoryName(categories, expense.category) : 'Expense';
  const isIncome = expense?.kind === 'income';

  function removeExpense() {
    if (!expense) {
      return;
    }
    Alert.alert('Delete this entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteExpense(expense.id);
          goBack();
        },
      },
    ]);
  }

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
        <Text style={styles.title}>Expense</Text>
      </View>

      {!expense ? (
        <Text style={styles.missing}>This expense is not available.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <CategoryIcon category={expense.category} />
            <Text style={styles.note}>{expense.title}</Text>
            <Text style={isIncome ? styles.income : styles.amount}>{formatPkr(expense.amount)}</Text>
            {expense.receiptUri ? (
              <Image source={{ uri: expense.receiptUri }} style={styles.receipt} contentFit="cover" />
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Type</Text>
            <Text style={styles.fieldValue}>{isIncome ? 'Income' : 'Expense'}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${name}`}
            onPress={() => router.push({ pathname: '/category/[id]', params: { id: expense.category } })}
            style={styles.field}>
            <Text style={styles.fieldLabel}>Category</Text>
            <Text style={styles.fieldValue}>{name}</Text>
            <Ionicons name="chevron-forward" size={sizes.smallIcon} color={colors.textMuted} />
          </Pressable>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Account</Text>
            <Text style={styles.fieldValue}>{accountName(expense.account)}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Date</Text>
            <Text style={styles.fieldValue}>{formatExpenseDate(expense.dateISO)}</Text>
          </View>

          {expense.repeatMonthly ? (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Repeat</Text>
              <Text style={styles.fieldValue}>Every month</Text>
            </View>
          ) : null}
          {expense.remind ? (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Reminder</Text>
              <Text style={styles.fieldValue}>On</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/add', params: { id: expense.id } })}
            style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={removeExpense} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </ScrollView>
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
  },
  missing: {
    ...type.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.screen,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.section,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.card,
    marginBottom: spacing.section,
    ...shadows.card,
  },
  note: {
    ...type.section,
    color: colors.textPrimary,
    marginTop: spacing.gap,
  },
  amount: {
    ...type.appTitle,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  income: {
    ...type.appTitle,
    color: colors.success,
    marginTop: spacing.xs,
  },
  receipt: {
    height: 180,
    borderRadius: radius.input,
    marginTop: spacing.gap,
  },
  field: {
    minHeight: sizes.listItem,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.gap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.card,
  },
  fieldLabel: {
    ...type.body,
    color: colors.textSecondary,
    width: 88,
  },
  fieldValue: {
    ...type.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  editButton: {
    height: sizes.button,
    borderRadius: radius.button,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.gap,
  },
  editText: {
    ...type.button,
    color: colors.white,
  },
  deleteButton: {
    height: sizes.button,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.gap,
  },
  deleteText: {
    ...type.button,
    color: colors.danger,
  },
});
}
