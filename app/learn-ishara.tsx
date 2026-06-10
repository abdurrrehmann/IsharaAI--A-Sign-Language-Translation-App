import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function LearnIshara() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>SignAcademy</Text>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput placeholder="Search PSL words" style={styles.search} placeholderTextColor="#666" />
      </View>

      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>Sign image / video</Text>
      </View>

      <View style={styles.moduleList}>
        <View style={styles.moduleCard}><Text style={styles.moduleTitle}>Alphabet</Text></View>
        <View style={styles.moduleCard}><Text style={styles.moduleTitle}>Common Words</Text></View>
        <View style={styles.moduleCard}><Text style={styles.moduleTitle}>Daily Phrases</Text></View>
      </View>

      <View style={styles.progressPlaceholder}>
        <Text style={styles.progressText}>Progress indicator placeholder</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', color: '#001F3F', marginBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#e6e6e6', paddingHorizontal: 12, marginBottom: 12 },
  search: { flex: 1, marginLeft: 8 },
  placeholderBox: { height: 200, borderRadius: 10, backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  placeholderText: { color: '#666' },
  moduleList: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 12 },
  moduleCard: { flex: 1, marginHorizontal: 4, paddingVertical: 12, backgroundColor: '#20c997', borderRadius: 8, alignItems: 'center' },
  moduleTitle: { color: '#001F3F', fontWeight: '700' },
  progressPlaceholder: { height: 36, borderRadius: 8, backgroundColor: '#fff7e6', borderWidth: 1, borderColor: '#ffd580', alignItems: 'center', justifyContent: 'center' },
  progressText: { color: '#b36b00' },
});
