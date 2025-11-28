# Quran Notification App

A React Native (Expo) application that sends push notifications with Quran verses based on the user's selected mood.

## Features

- Select your current mood (happy, sad, thankful, stressed, grateful)
- Receive a Quran verse notification tailored to your mood
- Clean, maintainable code structure
- Graceful handling of invalid moods

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on your device:
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

## Project Structure

```
├── src/
│   ├── data/
│   │   └── verses.json          # Mood-to-verse mappings
│   ├── services/
│   │   └── notificationService.ts  # Notification logic
│   └── types/
│       └── index.ts             # TypeScript types
├── App.tsx                      # Main app component
├── app.json                     # Expo configuration
└── package.json                 # Dependencies
```

## Usage

```typescript
import { sendMoodNotification } from './src/services/notificationService';

// Send notification based on mood
await sendMoodNotification('happy');
```

## Permissions

The app will request notification permissions on first launch.
