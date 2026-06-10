import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import Footer from './components/Footer';
import AboutScreen from './screens/AboutScreen';
import HomeScreen from './screens/HomeScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.toggleDrawer()}
                  style={styles.menuButton}
                  accessibilityLabel="Open drawer"
                >
                  <Ionicons name="menu" size={28} color="#111" />
                </TouchableOpacity>
              ),
              headerTitleAlign: 'center',
              headerStyle: styles.header,
              headerTitleStyle: styles.headerTitle,
            })}
          >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="About" component={AboutScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  menuButton: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 6 : 10,
  },
  header: {
    backgroundColor: '#fff',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
