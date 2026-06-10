import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Navbar({ navigation }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation?.toggleDrawer()} style={styles.left}>
        <Ionicons name="menu" size={26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.title}>IsharaAI</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.langBtn}>
          <Text style={styles.langText}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langBtn, styles.langBtnActive]}>
          <Text style={[styles.langText, styles.langTextActive]}>اردو</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#001F3F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  left: { width: 40, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  right: { width: 120, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  langBtnActive: { backgroundColor: '#20c997' },
  langText: { color: '#fff', fontWeight: '600' },
  langTextActive: { color: '#001F3F' },
});
