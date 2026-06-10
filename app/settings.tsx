import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  const [language, setLanguage] = React.useState('en');
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [learningMode, setLearningMode] = React.useState('visual');
  const [difficulty, setDifficulty] = React.useState('beginner');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Settings & Profile</Text>
      <Text style={styles.text}>Placeholder settings and profile UI.</Text>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferences</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialIcons name="language" size={20} color="#001F3F" />
            <Text style={styles.rowLabel}>Language</Text>
          </View>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentItem, language === 'en' && styles.segmentItemActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.segmentText, language === 'en' && styles.segmentTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentItem, language === 'ur' && styles.segmentItemActive]}
              onPress={() => setLanguage('ur')}
            >
              <Text style={[styles.segmentText, language === 'ur' && styles.segmentTextActive]}>اردو</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={20} color="#001F3F" />
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            trackColor={{ false: '#ccc', true: '#20c997' }}
            thumbColor={Platform.OS === 'android' ? (darkMode ? '#fff' : '#fff') : undefined}
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={20} color="#001F3F" />
            <Text style={styles.rowLabel}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: '#ccc', true: '#20c997' }}
            thumbColor={Platform.OS === 'android' ? (notifications ? '#fff' : '#fff') : undefined}
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>
      </View>

      {/* Learning Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Learning Preferences</Text>

        <Text style={styles.subLabel}>Preferred Learning Mode</Text>
        <View style={styles.pillRow}>
          <TouchableOpacity
            style={[styles.pill, learningMode === 'visual' && styles.pillActive]}
            onPress={() => setLearningMode('visual')}
          >
            <Ionicons name="images-outline" size={18} color={learningMode === 'visual' ? '#001F3F' : '#444'} />
            <Text style={[styles.pillText, learningMode === 'visual' && styles.pillTextActive]}>Visual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, learningMode === 'text' && styles.pillActive]}
            onPress={() => setLearningMode('text')}
          >
            <Ionicons name="document-text-outline" size={18} color={learningMode === 'text' ? '#001F3F' : '#444'} />
            <Text style={[styles.pillText, learningMode === 'text' && styles.pillTextActive]}>Text-based</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subLabel}>Difficulty Level</Text>
        <View style={styles.pillRow}>
          <TouchableOpacity
            style={[styles.pill, difficulty === 'beginner' && styles.pillActive]}
            onPress={() => setDifficulty('beginner')}
          >
            <Text style={[styles.pillText, difficulty === 'beginner' && styles.pillTextActive]}>Beginner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, difficulty === 'intermediate' && styles.pillActive]}
            onPress={() => setDifficulty('intermediate')}
          >
            <Text style={[styles.pillText, difficulty === 'intermediate' && styles.pillTextActive]}>Intermediate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>v1.0</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.infoTitle}>About IsharaAI</Text>
        <Text style={styles.infoText}>
          IsharaAI helps students learn Pakistani Sign Language (PSL) using modern AI-powered tools. This is a UI
          prototype for demonstration.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.infoTitle}>Help & Support</Text>
        <Text style={styles.infoText}>For help, contact support@ishara.ai (UI only placeholder).</Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', color: '#001F3F', marginBottom: 12 },
  text: { color: '#444' },
  card: { borderRadius: 8, backgroundColor: '#f9f9f9', marginBottom: 16, overflow: 'hidden' },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#001F3F', padding: 16, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { marginLeft: 8, fontSize: 16, color: '#001F3F' },
  segment: { flexDirection: 'row' },
  segmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    marginLeft: 8,
  },
  segmentItemActive: { backgroundColor: '#20c997' },
  segmentText: { fontSize: 16, color: '#001F3F' },
  segmentTextActive: { color: '#fff' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 8 },
  subLabel: { fontSize: 14, color: '#666', marginLeft: 16, marginBottom: 8 },
  pillRow: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 16 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  pillActive: { backgroundColor: '#20c997' },
  pillText: { fontSize: 16, color: '#001F3F' },
  pillTextActive: { color: '#fff' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  infoLabel: { fontSize: 16, color: '#666' },
  infoValue: { fontSize: 16, color: '#001F3F', fontWeight: '500' },
  infoTitle: { fontSize: 16, fontWeight: '600', color: '#001F3F', marginTop: 8 },
  infoText: { fontSize: 14, color: '#444', lineHeight: 20, marginTop: 4 },
});
