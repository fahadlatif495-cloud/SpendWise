import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { type CategoryKey, colors, radius, sizes } from '@/theme';

const ICONS = {
  food: 'restaurant',
  transport: 'car',
  bills: 'receipt',
  shopping: 'bag-handle',
  entertainment: 'film',
  other: 'ellipsis-horizontal',
} as const satisfies Record<CategoryKey, keyof typeof Ionicons.glyphMap>;

type CategoryIconProps = {
  category: CategoryKey;
  /** Chips show the icon alone. Rows and cards use the 44px tinted box. */
  boxed?: boolean;
};

/** Category mark used on transaction rows, chips, and category cards. */
export function CategoryIcon({ category, boxed = true }: CategoryIconProps) {
  const icon = (
    <Ionicons name={ICONS[category]} size={sizes.categoryIcon} color={colors.categories[category]} />
  );

  if (!boxed) {
    return icon;
  }

  return <View style={[styles.box, tintStyles[category]]}>{icon}</View>;
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

const tintStyles = StyleSheet.create({
  food: { backgroundColor: colors.categoryTints.food },
  transport: { backgroundColor: colors.categoryTints.transport },
  bills: { backgroundColor: colors.categoryTints.bills },
  shopping: { backgroundColor: colors.categoryTints.shopping },
  entertainment: { backgroundColor: colors.categoryTints.entertainment },
  other: { backgroundColor: colors.categoryTints.other },
});
