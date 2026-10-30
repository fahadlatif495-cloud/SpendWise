import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppSplash } from '@/components/AppSplash';
import { ThemeProvider, useThemeChoice } from '@/components/ThemeProvider';
import { ExpenseProvider } from '@/expenses/ExpenseContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <RootView />
      </ExpenseProvider>
    </ThemeProvider>
  );
}

function RootView() {
  const { colors, isDark } = useThemeChoice();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={showSplash || isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" />
      </Stack>
      {showSplash ? <AppSplash onFinish={() => setShowSplash(false)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
