import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/CategoryIcon';
import { ExpenseDateField } from '@/components/ExpenseDateField';
import { useColors } from '@/components/ThemeProvider';
import { ACCOUNTS, type AccountId } from '@/expenses/accounts';
import { categoryName } from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { currentMonthKey, parseAmount, toISODate } from '@/expenses/format';
import { saveReceipt } from '@/expenses/receipts';
import { scheduleReminder } from '@/expenses/reminders';
import { type MoneyKind } from '@/expenses/seed';
import { type AppColors, radius, sizes, spacing, type } from '@/theme';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.navigate('/');
  }
}

export default function AddExpenseScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ category?: string; id?: string }>();
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const editId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { addExpense, updateExpense, categories, expenses, monthlyBudget, totalThisMonth } = useExpenses();
  const editing = expenses.find((item) => item.id === editId);
  const preset = editing?.category ?? categoryParam;
  const [amountText, setAmountText] = useState(editing ? String(editing.amount) : '');
  const [note, setNote] = useState(editing?.title ?? '');
  const [category, setCategory] = useState(
    preset && categories.some((item) => item.id === preset) ? preset : 'food',
  );
  const [date, setDate] = useState(() => {
    if (!editing) {
      return new Date();
    }
    const [year, month, day] = editing.dateISO.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  const [kind, setKind] = useState<MoneyKind>(editing?.kind === 'income' ? 'income' : 'expense');
  const [account, setAccount] = useState<AccountId>(editing?.account ?? 'cash');
  const [repeatMonthly, setRepeatMonthly] = useState(editing?.repeatMonthly ?? false);
  const [remind, setRemind] = useState(editing?.remind ?? false);
  const [receiptUri, setReceiptUri] = useState(editing?.receiptUri);
  const [error, setError] = useState('');

  async function pickReceipt() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photos to attach a receipt.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
    });
    if (result.canceled) {
      return;
    }

    try {
      setReceiptUri(saveReceipt(result.assets[0].uri));
    } catch {
      setReceiptUri(result.assets[0].uri);
    }
  }

  function saveExpense() {
    const amount = parseAmount(amountText);
    if (amount == null) {
      setError('Enter an amount');
      return;
    }

    Keyboard.dismiss();
    const next = {
      title: note.trim() || categoryName(categories, category),
      category,
      dateISO: toISODate(date),
      amount,
      kind,
      account,
      repeatMonthly,
      remind,
      receiptUri,
      seriesId: editing?.seriesId,
    };

    if (editing) {
      updateExpense(editing.id, next);
    } else {
      addExpense(next);
    }

    if (remind) {
      const label = kind === 'income' ? 'Income' : 'Bill';
      scheduleReminder(`${label}: ${next.title}`, next.dateISO).catch(() => {});
    }

    if (kind === 'expense' && monthlyBudget > 0 && next.dateISO.startsWith(currentMonthKey())) {
      const oldAmount =
        editing && editing.kind !== 'income' && editing.dateISO.startsWith(currentMonthKey())
          ? editing.amount
          : 0;
      const before = totalThisMonth / monthlyBudget;
      const after = (totalThisMonth - oldAmount + amount) / monthlyBudget;
      if (before < 0.8 && after >= 0.8) {
        scheduleReminder('You are near this month’s budget.', next.dateISO).catch(() => {});
      }
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/');
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
        <Text style={styles.title}>{editing ? 'Edit' : kind === 'income' ? 'Add Income' : 'Add Expense'}</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.choiceRow}>
          {(['expense', 'income'] as const).map((item) => {
            const selected = kind === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setKind(item)}
                style={selected ? [styles.choice, styles.choiceSelected] : styles.choice}>
                <Text style={styles.choiceText}>{item === 'income' ? 'Income' : 'Expense'}</Text>
              </Pressable>
            );
          })}
        </View>

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
          {categories.map((item) => {
            const selected = item.id === category;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCategory(item.id)}
                style={selected ? [styles.chip, styles.chipSelected] : styles.chip}>
                <CategoryIcon category={item.id} boxed={false} />
                <Text style={styles.chipLabel}>{item.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.fieldLabel}>Account</Text>
        <View style={styles.choiceRow}>
          {ACCOUNTS.map((item) => {
            const selected = account === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setAccount(item.id)}
                style={selected ? [styles.choice, styles.choiceSelected] : styles.choice}>
                <Text style={styles.choiceText}>{item.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <ExpenseDateField date={date} onChange={setDate} />

        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: repeatMonthly }}
          onPress={() => setRepeatMonthly((current) => !current)}
          style={styles.toggle}>
          <Text style={styles.toggleText}>Repeat every month</Text>
          <Text style={styles.toggleValue}>{repeatMonthly ? 'On' : 'Off'}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: remind }}
          onPress={() => setRemind((current) => !current)}
          style={styles.toggle}>
          <Text style={styles.toggleText}>Remind me</Text>
          <Text style={styles.toggleValue}>{remind ? 'On' : 'Off'}</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={pickReceipt} style={styles.receiptButton}>
          <Ionicons name="image-outline" size={sizes.smallIcon} color={colors.primary} />
          <Text style={styles.receiptText}>{receiptUri ? 'Change receipt' : 'Add receipt photo'}</Text>
        </Pressable>
        {receiptUri ? <Image source={{ uri: receiptUri }} style={styles.receipt} contentFit="cover" /> : null}

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
        <Text style={styles.saveText}>{editing ? 'Save Changes' : kind === 'income' ? 'Save Income' : 'Save Expense'}</Text>
      </Pressable>
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
    backgroundColor: colors.primaryButton,
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
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.section,
  },
  choice: {
    height: sizes.chip,
    borderRadius: radius.chip,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.gap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  choiceText: {
    ...type.chip,
    color: colors.textPrimary,
  },
  fieldLabel: {
    ...type.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.section,
    marginBottom: spacing.xs,
  },
  toggle: {
    height: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    marginTop: spacing.gap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    ...type.body,
    color: colors.textPrimary,
  },
  toggleValue: {
    ...type.body,
    fontWeight: '600',
    color: colors.primary,
  },
  receiptButton: {
    height: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    marginTop: spacing.gap,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  receiptText: {
    ...type.body,
    color: colors.primary,
  },
  receipt: {
    height: 160,
    borderRadius: radius.input,
    marginTop: spacing.gap,
  },
});
}
