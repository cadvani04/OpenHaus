import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import ClientFormScreen from './screens/ClientFormScreen';
import RealtorDashboardScreen from './screens/RealtorDashboardScreen';
import AgreementsScreen from './screens/AgreementsScreen';
import ClientsScreen from './screens/ClientsScreen';
import OpenHousesScreen from './screens/OpenHousesScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RealtorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Agreements') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Clients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Open Houses') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Agreements" component={AgreementsScreen} />
      <Tab.Screen name="Clients" component={ClientsScreen} />
      <Tab.Screen name="Open Houses" component={OpenHousesScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isRealtorMode, setIsRealtorMode] = useState(false);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientForm" component={ClientFormScreen} />
        <Stack.Screen name="RealtorDashboard" component={RealtorTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 