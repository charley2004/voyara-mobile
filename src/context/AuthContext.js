// src/context/AuthContext.js
// ─────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES:
// Global state management for authentication.
// Any screen in the app can access the current user,
// login, logout, and loading state without prop drilling.
//
// CONCEPT TO LEARN: React Context
// Context solves this problem:
// Without context: App → Navigator → Screen → Component → user
//                  (passing user as prop through every level)
// With context:    Any component grabs user directly
//
// CONCEPT TO LEARN: useContext + useReducer
// useReducer manages complex state with multiple possible
// actions — similar to Redux but built into React.
// ─────────────────────────────────────────────────────────────

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/apiService';

// Create the context
const AuthContext = createContext();

// ── Reducer ───────────────────────────────────────────────────
// A reducer takes current state and an action, returns new state.
// action.type tells it what to do.
// action.payload is the data to work with.
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    case 'UPDATE_USER':
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // true on startup while we check stored token
};

// ── Provider Component ────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Check Stored Token on App Start ───────────────────
  // When app opens, check if user has a saved token.
  // If yes, log them in automatically — no need to re-enter password.
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');

      if (token && userString) {
        const user = JSON.parse(userString);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ── Login Function ────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      // Save to phone storage — persists after app closes
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // ── Register Function ─────────────────────────────────
  const register = async (name, email, password, phone) => {
    try {
      const response = await authAPI.register({ name, email, password, phone });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // ── Logout Function ───────────────────────────────────
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — makes using context cleaner in screens
// Instead of: const { user } = useContext(AuthContext)
// You write:   const { user } = useAuth()
export const useAuth = () => useContext(AuthContext);