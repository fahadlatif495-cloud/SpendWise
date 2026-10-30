import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useColors } from '@/components/ThemeProvider';
import { useExpenses } from '@/expenses/ExpenseContext';
import { radius, sizes } from '@/theme';

type CategoryIconProps = {
  category: string;
  /** Chips show the icon alone. Rows and cards use the 44px tinted box. */
  boxed?: boolean;
};

/** Category mark used on transaction rows, chips, and category cards. */
export function CategoryIcon({ category, boxed = true }: CategoryIconProps) {
  const colors = useColors();
  const { categories } = useExpenses();
  const match = categories.find((item) => item.id === category);
  const iconName = match?.icon ?? 'ellipsis-horizontal';
  const color = match?.color ?? colors.categories.other;
  const tint = match?.tint ?? colors.categoryTints.other;

  const icon = <Ionicons name={iconName} size={sizes.categoryIcon} color={color} />;

  if (!boxed) {
    return icon;
  }

  return <View style={[styles.box, { backgroundColor: tint }]}>{icon}</View>;
}

const styles = StyleSheet.create({
  box: {
    width: sizes.categoryIconBox,
    height: sizes.categoryIconBox,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
