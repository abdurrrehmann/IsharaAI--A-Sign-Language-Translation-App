import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
// About screen removed in cleanup
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomeScreen from './home';

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{ header: (props) => <Navbar {...props} /> }}
          >
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Drawer.Screen name="LearnIshara" component={require('./learn-ishara').default} options={{ title: 'Learn Ishara' }} />
            <Drawer.Screen name="LiveIshara" component={require('./live-ishara').default} options={{ title: 'Live Ishara' }} />
            <Drawer.Screen name="Settings" component={require('./settings').default} options={{ title: 'Settings' }} />
          </Drawer.Navigator>
        </View>

        <Footer />
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  menuButton: { paddingHorizontal: 16, paddingVertical: Platform.OS === 'android' ? 6 : 10 },
  header: { backgroundColor: '#fff', shadowOpacity: 0, elevation: 0 },
  headerTitle: { fontSize: 16, fontWeight: '600' },
});
