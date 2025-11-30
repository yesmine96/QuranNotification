import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import privacyPolicy from './data/privacyPolicy';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.text}>{privacyPolicy}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default PrivacyPolicyScreen;
