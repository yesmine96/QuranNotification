import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Alert,
  SafeAreaView,
  Modal,
  Pressable
} from 'react-native';
import privacyPolicy from './src/data/privacyPolicy';
import { 
  sendMoodNotification, 
  getAvailableMoods,
  requestNotificationPermissions 
} from './src/services/notificationService';

export default function App() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [moods, setMoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Request notification permissions on app start
    await requestNotificationPermissions();
    
    // Load available moods
    const availableMoods = getAvailableMoods();
    setMoods(availableMoods);
  };

  const handleMoodSelection = async (mood: string) => {
    setSelectedMood(mood);
    setIsLoading(true);

    try {
      await sendMoodNotification(mood, 0)
      
    } catch (error) {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (mood: string): string => {
    const emojiMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      thankful: '🙏',
      stressed: '😰',
      grateful: '💚',
      anxious: '😟',
      hopeful: '🌟',
    };
    return emojiMap[mood.toLowerCase()] || '💭';
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Quran Verse Notifications</Text>
          <Text style={styles.subtitle}>
            Select your current mood to receive a comforting verse
          </Text>
        </View>

        <View style={styles.moodsContainer}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && styles.moodButtonSelected,
              ]}
              onPress={() => handleMoodSelection(mood)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
              <Text
                style={[
                  styles.moodText,
                  selectedMood === mood && styles.moodTextSelected,
                ]}
              >
                {capitalizeFirst(mood)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Scheduling notification...</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. Select your current mood{'\n'}
            2. A notification will be scheduled{'\n'}
            3. Receive your personalized Quran verse in 5 seconds
          </Text>
        </View>

        <TouchableOpacity
          style={styles.privacyLink}
          onPress={() => setShowPrivacyModal(true)}
        >
          <Text style={styles.privacyLinkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showPrivacyModal}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <Pressable onPress={() => setShowPrivacyModal(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>{privacyPolicy}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  moodButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  moodTextSelected: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 22,
  },
  privacyLink: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  privacyLinkText: {
    color: '#3498DB',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
  },
});
