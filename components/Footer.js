import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>IsharaAI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
});
