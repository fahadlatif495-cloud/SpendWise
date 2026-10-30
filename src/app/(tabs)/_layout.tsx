import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useColors } from '@/components/ThemeProvider';
import { type AppColors, sizes } from '@/theme';

function tabIconColor(color: unknown, fallback: string) {
  return typeof color === 'string' ? color : fallback;
}

export default function TabLayout() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={sizes.navIcon}
              color={tabIconColor(color, colors.textMuted)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={sizes.navIcon}
              color={tabIconColor(color, colors.textMuted)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={sizes.navIcon}
              color={tabIconColor(color, colors.textMuted)}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: sizes.tabBar,
      paddingTop: 6,
      paddingBottom: 6,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16.8,
    },
  });
}
