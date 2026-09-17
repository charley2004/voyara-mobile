// src/navigation/AppNavigator.js
// ─────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES:
// Controls which screens the user can see based on auth state.
// If logged in → show main app screens
// If not logged in → show auth screens
// This switch happens automatically when login/logout is called.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import PackagesScreen from '../screens/main/PackagesScreen';
import PackageDetailScreen from '../screens/main/PackageDetailScreen';
import BookingScreen from '../screens/main/BookingScreen';
import MyBookingsScreen from '../screens/main/MyBookingsScreen';
import RideBookingScreen from '../screens/rides/RideBookingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Bottom Tab Navigator (Main App) ───────────────────────────
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: 5,
        height: 60,
      },
      tabBarActiveTintColor: '#1A1A2E',
      tabBarInactiveTintColor: '#999999',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name="Packages"
      component={PackagesScreen}
      options={{ tabBarLabel: 'Packages' }}
    />
    <Tab.Screen
      name="MyBookings"
      component={MyBookingsScreen}
      options={{ tabBarLabel: 'My Trips' }}
    />
    <Tab.Screen
      name="Rides"
      component={RideBookingScreen}
      options={{ tabBarLabel: 'Rides' }}
    />
  </Tab.Navigator>
);

// ── Root Navigator ────────────────────────────────────────────
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show spinner while checking stored token
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1A1A2E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack — shown when not logged in
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main Stack — shown when logged in
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="PackageDetail" component={PackageDetailScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;