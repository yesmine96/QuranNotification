export type Mood = 'happy' | 'sad' | 'thankful' | 'stressed' | 'grateful' | 'anxious' | 'hopeful';

export interface VersesData {
  [mood: string]: string[];
}

export interface NotificationContent {
  title: string;
  body: string;
}
