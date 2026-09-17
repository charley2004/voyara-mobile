import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const quickActions = [
    { label: 'Holiday\nPackages', screen: 'Packages', color: '#1A1A2E' },
    { label: 'Book\na Ride', screen: 'Rides', color: '#E94560' },
    { label: 'My\nTrips', screen: 'MyBookings', color: '#1A1A2E' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0]} 👋
            </Text>
            <Text style={styles.subGreeting}>Where are you headed?</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>VOYARA</Text>
          <Text style={styles.heroTitle}>Travel,{'\n'}your way.</Text>
          <Text style={styles.heroSub}>
            Packages, rides and experiences — all in one place.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>What are you looking for?</Text>
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Strip */}
        <View style={styles.infoStrip}>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>50+</Text>
            <Text style={styles.infoLabel}>Destinations</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>24/7</Text>
            <Text style={styles.infoLabel}>Support</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>100%</Text>
            <Text style={styles.infoLabel}>Secure Pay</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  subGreeting: {
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  },
  logoutText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 28,
    marginBottom: 32,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E94560',
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 42,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    color: '#8A8A9A',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 100,
    justifyContent: 'flex-end',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  infoStrip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  infoLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 4,
  },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#EFEFEF',
  },
});