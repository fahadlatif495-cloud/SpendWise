import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppSplash } from '@/components/AppSplash';
import { ExpenseProvider } from '@/expenses/ExpenseContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ExpenseProvider>
      <View style={styles.root}>
        <StatusBar style={showSplash ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add" />
        </Stack>
        {showSplash ? <AppSplash onFinish={() => setShowSplash(false)} /> : null}
      </View>
    </ExpenseProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
