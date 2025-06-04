import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChatScreen from "./screens/ChatScreen";
import InfoScreen from "./screens/InfoScreen";
  
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F7FAFC' },
        animation: 'fade_from_bottom',
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
  
export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <NavigationContainer theme={{
        dark: false,
        colors: {
          primary: '#5E72E4',
          background: '#F7FAFC',
          card: '#FFFFFF',
          text: '#2D3748',
          border: '#E9ECEF',
          notification: '#FF5252',
        }
      }}>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none",
    backgroundColor: '#F7FAFC',
  }
});