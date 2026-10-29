import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, type } from '@/theme';

const ICON = require('../../assets/images/icon.png');
const VISIBLE_MS = 1200;
const FADE_MS = 350;

type AppSplashProps = {
  onFinish: () => void;
};

/** Branded launch screen shown over the app until the first screen is ready. */
export function AppSplash({ onFinish }: AppSplashProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const onFinishRef = useRef(onFinish);
  const [blocking, setBlocking] = useState(true);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlocking(false);
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => {
        onFinishRef.current();
      });
    }, VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [opacity]);

  return (
    <Animated.View pointerEvents={blocking ? 'auto' : 'none'} style={[styles.screen, { opacity }]}>
      <Image source={ICON} style={styles.logo} contentFit="cover" />
      <Text style={styles.name}>SpendWise</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    elevation: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: radius.card,
  },
  name: {
    ...type.appTitle,
    color: colors.white,
    marginTop: spacing.section,
  },
});
