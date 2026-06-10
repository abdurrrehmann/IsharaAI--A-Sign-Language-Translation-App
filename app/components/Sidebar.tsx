import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Sidebar({ navigation }: any) {
  const Item = ({ label, route }: { label: string; route: string }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation?.navigate(route);
        navigation?.closeDrawer();
      }}
    >
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>IsharaAI</Text>
        <Text style={styles.brandSub}>PSL Learning with AI</Text>
      </View>

      <View style={styles.items}>
        <Item label="Home" route="Home" />
        <Item label="SignAcademy" route="LearnIshara" />
        <Item label="SignDetect" route="LiveIshara" />
        <Item label="Settings / Profile" route="Settings" />
      </View>

      <View style={styles.footerWrap}>
        <Text style={styles.small}>© 2025 IsharaAI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  brand: { color: '#001F3F', fontSize: 20, fontWeight: '800' },
  brandSub: { color: '#666', marginTop: 6 },
  items: { paddingTop: 12 },
  item: { paddingVertical: 14, paddingHorizontal: 20 },
  itemText: { fontSize: 16, color: '#001F3F', fontWeight: '600' },
  footerWrap: { marginTop: 'auto', padding: 16, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
  small: { color: '#999', fontSize: 12 },
});
