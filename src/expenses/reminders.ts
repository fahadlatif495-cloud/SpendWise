import { AndroidImportance, SchedulableTriggerInputTypes, scheduleNotificationAsync, setNotificationChannelAsync, setNotificationHandler, getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';
import { Platform } from 'react-native';

setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensurePermission() {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: 'SpendWise',
      importance: AndroidImportance.DEFAULT,
    });
  }

  const current = await getPermissionsAsync();
  if (current.status === 'granted') {
    return true;
  }

  const asked = await requestPermissionsAsync();
  return asked.status === 'granted';
}

/** Local reminder on the phone. No server and no Firebase. */
export async function scheduleReminder(title: string, dateISO: string) {
  const allowed = await ensurePermission();
  if (!allowed) {
    return;
  }

  const [year, month, day] = dateISO.split('-').map(Number);
  let when = new Date(year, (month || 1) - 1, day || 1, 9, 0, 0);
  if (when.getTime() <= Date.now()) {
    when = new Date();
    when.setDate(when.getDate() + 1);
    when.setHours(9, 0, 0, 0);
  }

  await scheduleNotificationAsync({
    content: {
      title: 'SpendWise',
      body: title,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
}
