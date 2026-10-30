import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors, useThemeChoice } from '@/components/ThemeProvider';
import { formatExpenseDate, toISODate } from '@/expenses/format';
import { type AppColors, radius, shadows, sizes, spacing, type } from '@/theme';

type ExpenseDateFieldProps = {
  date: Date;
  onChange: (date: Date) => void;
};

/** Tappable date row. Android opens the system dialog. iOS opens a spinner sheet. */
export function ExpenseDateField({ date, onChange }: ExpenseDateFieldProps) {
  const colors = useColors();
  const { isDark } = useThemeChoice();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose date"
        onPress={() => setOpen(true)}
        style={styles.dateField}>
        <Text style={styles.dateValue}>{formatExpenseDate(toISODate(date))}</Text>
        <Ionicons name="calendar-outline" size={sizes.smallIcon} color={colors.textSecondary} />
      </Pressable>

      {open && Platform.OS === 'android' ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onValueChange={(_event, selected) => {
            setOpen(false);
            onChange(selected);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <View style={styles.backdrop}>
            <Pressable
              accessibilityLabel="Close date picker"
              onPress={() => setOpen(false)}
              style={styles.backdropFill}
            />
            <View style={styles.sheet}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                themeVariant={isDark ? 'dark' : 'light'}
                textColor={colors.textPrimary}
                onValueChange={(_event, selected) => onChange(selected)}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setOpen(false)}
                style={styles.doneButton}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  dateField: {
    height: sizes.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screen,
    marginTop: spacing.section,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateValue: {
    ...type.body,
    color: colors.textPrimary,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  backdropFill: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    padding: spacing.screen,
    ...shadows.card,
  },
  doneButton: {
    height: sizes.button,
    borderRadius: radius.button,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    ...type.button,
    color: colors.white,
  },
});
}
