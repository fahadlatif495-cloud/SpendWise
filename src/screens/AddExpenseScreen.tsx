import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { ExpenseDateField } from '@/components/ExpenseDateField';
import { CATEGORIES, categoryLabel } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { parseAmount, toISODate } from '@/expenses/format';
import { type CategoryKey, colors, radius, sizes, spacing, type } from '@/theme';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.navigate('/index');
  }
}

export default function AddExpenseScreen() {
  const { addExpense } = useExpenses();
  const [amountText, setAmountText] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<CategoryKey>('food');
  const [date, setDate] = useState(() => new Date());
  const [error, setError] = useState('');

  function saveExpense() {
    const amount = parseAmount(amountText);
    if (amount == null) {
      setError('Enter an amount');
      return;
    }

    Keyboard.dismiss();
    addExpense({
      title: note.trim() || categoryLabel(category),
      category,
      dateISO: toISODate(date),
      amount,
    });
    setAmountText('');
    setNote('');
    setCategory('food');
    setDate(new Date());
    setError('');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/index');
    }
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
        <Text style={styles.title}>Add Expense</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.amountWrap}>
          <View style={styles.amountRow}>
            <Text style={styles.amountPrefix}>PKR</Text>
            <TextInput
              style={styles.amountInput}
              value={amountText}
              onChangeText={(value) => {
                setAmountText(value);
                if (error) {
                  setError('');
                }
              }}
              placeholder="0"
              placeholderTextColor={colors.primary}
              keyboardType="decimal-pad"
              selectionColor={colors.primary}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map((item) => {
            const selected = item.key === category;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCategory(item.key)}
                style={selected ? [styles.chip, styles.chipSelected] : styles.chip}>
                <CategoryIcon category={item.key} boxed={false} />
                <Text style={styles.chipLabel}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ExpenseDateField date={date} onChange={setDate} />

        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note..."
          placeholderTextColor={colors.textMuted}
          multiline
          underlineColorAndroid="transparent"
          selectionColor={colors.primary}
        />
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save expense"
        onPress={saveExpense}
        style={({ pressed }) => [styles.saveButton, pressed && styles.savePressed]}>
        <Text style={styles.saveText}>Save Expense</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.section,
    paddingBottom: spacing.screen,
  },
  amountWrap: {
    alignSelf: 'center',
    minWidth: 180,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.xs,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  amountPrefix: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    color: colors.textSecondary,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 67.2,
    color: colors.primary,
    minWidth: 48,
    padding: 0,
    margin: 0,
  },
  error: {
    ...type.secondary,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  chipScroll: {
    flexGrow: 0,
    marginTop: spacing.section,
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
  noteInput: {
    minHeight: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.gap,
    marginTop: spacing.section,
    textAlignVertical: 'top',
    ...type.body,
    color: colors.textPrimary,
  },
  saveButton: {
    height: sizes.button,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.screen,
  },
  savePressed: {
    opacity: 0.9,
  },
  saveText: {
    ...type.button,
    color: colors.white,
  },
});
