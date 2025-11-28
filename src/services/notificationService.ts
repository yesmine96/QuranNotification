import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import versesData from '../data/verses.json';
import { VersesData, NotificationContent } from '../types';

/**
 * Configure notification handler for foreground notifications
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 * @returns Promise<boolean> - true if permission granted, false otherwise
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    console.log('Requesting notification permissions...');
    console.log('Platform:', Platform.OS);
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing permission status:', existingStatus);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log('Requesting permissions...');
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('New permission status:', status);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      console.log('Configuring Android notification channel...');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    console.log('Notification permissions granted successfully');
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    console.error('Error details:', JSON.stringify(error));
    return false;
  }
};

/**
 * Get a random verse from a specific mood array
 * @param mood - The mood to get a verse for
 * @returns string - A random verse for the given mood
 */
const getVerseForMood = (mood: string): string => {
  const verses = versesData as VersesData;
  const moodLower = mood.toLowerCase().trim();

  // Check if the mood exists in our data
  if (verses[moodLower] && verses[moodLower].length > 0) {
    const moodVerses = verses[moodLower];
    const randomIndex = Math.floor(Math.random() * moodVerses.length);
    return moodVerses[randomIndex];
  }

  // If mood doesn't exist, get a random verse from all moods
  console.warn(`Mood "${mood}" not found. Selecting random verse from all moods.`);
  return getRandomVerseFromAll(verses);
};

/**
 * Get a random verse from all available moods
 * @param verses - The verses data object
 * @returns string - A random verse from any mood
 */
const getRandomVerseFromAll = (verses: VersesData): string => {
  const allVerses: string[] = [];
  
  // Flatten all verses into a single array
  Object.values(verses).forEach((moodVerses) => {
    allVerses.push(...moodVerses);
  });

  if (allVerses.length === 0) {
    return 'No verses available at this time.';
  }

  const randomIndex = Math.floor(Math.random() * allVerses.length);
  return allVerses[randomIndex];
};

/**
 * Schedule a push notification with a Quran verse based on the user's mood
 * @param mood - The user's current mood (e.g., "happy", "sad", "thankful")
 * @param delaySeconds - Optional delay in seconds before showing notification (default: 5)
 * @returns Promise<string | null> - Notification identifier if successful, null if failed
 */
export const sendMoodNotification = async (
  mood: string,
  delaySeconds: number = 5
): Promise<string | null> => {
  try {
    console.log('=== Starting sendMoodNotification ===');
    console.log('Mood:', mood);
    console.log('Delay:', delaySeconds);
    
    // Ensure we have notification permissions
    const hasPermission = await requestNotificationPermissions();
    console.log('Has permission:', hasPermission);
    
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    // Get the appropriate verse for the mood
    const verse = getVerseForMood(mood);
    console.log('Selected verse:', verse);

    // Prepare notification content
    const notificationContent: NotificationContent = {
      title: 'Quran Verse for You',
      body: verse,
    };

    console.log('Scheduling notification...');
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationContent.title,
        body: notificationContent.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
        repeats: false,
      },
    });

    console.log(`Notification scheduled successfully with ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error('=== Error in sendMoodNotification ===');
    console.error('Error sending mood notification:', error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown');
    return null;
  }
};

/**
 * Cancel a scheduled notification
 * @param notificationId - The ID of the notification to cancel
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notification ${notificationId} cancelled`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

/**
 * Get all available moods
 * @returns string[] - Array of available mood strings
 */
export const getAvailableMoods = (): string[] => {
  const verses = versesData as VersesData;
  return Object.keys(verses);
};
