// App.js — Entry point of the React Native app

import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // AuthProvider wraps everything so every screen
    // can access auth state via useAuth()
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}