import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors } from '@/components/ThemeProvider';
import {
  CATEGORY_ICON_CHOICES,
  CATEGORY_SWATCHES,
  type CategoryIconName,
} from '@/expenses/categories';
import { useExpenses } from '@/expenses/ExpenseContext';
import { parseAmount } from '@/expenses/format';
import { type AppColors, radius, sizes, spacing, type } from '@/theme';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.navigate('/categories');
  }
}

export default function AddCategoryScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { addCategory } = useExpenses();
  const [name, setName] = useState('');
  const [budgetText, setBudgetText] = useState('');
  const [swatchIndex, setSwatchIndex] = useState(0);
  const [icon, setIcon] = useState<CategoryIconName>(CATEGORY_ICON_CHOICES[0]);
  const [error, setError] = useState('');

  function saveCategory() {
    const trimmed = name.trim();
    const budget = parseAmount(budgetText);
    if (!trimmed) {
      setError('Enter a category name');
      return;
    }
    if (budget == null) {
      setError('Enter a monthly budget');
      return;
    }

    const swatch = CATEGORY_SWATCHES[swatchIndex] ?? CATEGORY_SWATCHES[0];
    Keyboard.dismiss();
    addCategory({
      name: trimmed,
      budget,
      color: swatch.color,
      tint: swatch.tint,
      icon,
    });
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/categories');
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
        <Text style={styles.title}>Add Category</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (error) {
              setError('');
            }
          }}
          placeholder="Category name"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
        />

        <Text style={styles.label}>Monthly budget</Text>
        <TextInput
          style={styles.input}
          value={budgetText}
          onChangeText={(value) => {
            setBudgetText(value);
            if (error) {
              setError('');
            }
          }}
          placeholder="PKR 5,000"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          selectionColor={colors.primary}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Color</Text>
        <View style={styles.choiceRow}>
          {CATEGORY_SWATCHES.map((swatch, index) => {
            const selected = index === swatchIndex;
            return (
              <Pressable
                key={swatch.color}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSwatchIndex(index)}
                style={[styles.swatch, { backgroundColor: swatch.color }, selected && styles.swatchSelected]}
              />
            );
          })}
        </View>

        <Text style={styles.label}>Icon</Text>
        <View style={styles.choiceRow}>
          {CATEGORY_ICON_CHOICES.map((choice) => {
            const selected = choice === icon;
            const swatch = CATEGORY_SWATCHES[swatchIndex] ?? CATEGORY_SWATCHES[0];
            return (
              <Pressable
                key={choice}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setIcon(choice)}
                style={[styles.iconChoice, { backgroundColor: swatch.tint }, selected && styles.iconSelected]}>
                <Ionicons name={choice} size={sizes.categoryIcon} color={swatch.color} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save category"
        onPress={saveCategory}
        style={({ pressed }) => [styles.saveButton, pressed && styles.savePressed]}>
        <Text style={styles.saveText}>Save Category</Text>
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
    paddingBottom: spacing.screen,
  },
  label: {
    ...type.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.section,
    marginBottom: spacing.xs,
  },
  input: {
    height: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    ...type.body,
    color: colors.textPrimary,
  },
  error: {
    ...type.secondary,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap,
  },
  swatch: {
    width: sizes.chip,
    height: sizes.chip,
    borderRadius: radius.chip,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  swatchSelected: {
    borderColor: colors.textPrimary,
  },
  iconChoice: {
    width: sizes.categoryIconBox,
    height: sizes.categoryIconBox,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  iconSelected: {
    borderColor: colors.primary,
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
});
}
