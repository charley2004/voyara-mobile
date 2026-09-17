import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function PackageDetailScreen({ route, navigation }) {
  const { package: pkg } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.bannerDestination}>{pkg.destination}</Text>
          <Text style={styles.bannerTitle}>{pkg.title}</Text>
          <Text style={styles.bannerDuration}>{pkg.durationDays} days</Text>
        </View>

        <View style={styles.body}>
          {/* Price */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Price per person</Text>
              <Text style={styles.price}>₦{pkg.price.toLocaleString()}</Text>
            </View>
            <View style={styles.slotsTag}>
              <Text style={styles.slotsText}>
                {pkg.availableSlots} slots left
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>About this package</Text>
          <Text style={styles.description}>{pkg.description}</Text>

          {/* Includes */}
          <Text style={styles.sectionTitle}>What's included</Text>
          <View style={styles.includesGrid}>
            {pkg.includes?.map((item, index) => (
              <View key={index} style={styles.includeItem}>
                <Text style={styles.includeDot}>✓</Text>
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate('Booking', { package: pkg })}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>Book this package</Text>
          </TouchableOpacity>
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
  banner: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  backBtn: {
    marginBottom: 24,
  },
  backText: {
    color: '#8A8A9A',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerDestination: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E94560',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerDuration: {
    fontSize: 14,
    color: '#8A8A9A',
  },
  body: {
    padding: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E94560',
  },
  slotsTag: {
    backgroundColor: '#F0FFF4',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  slotsText: {
    fontSize: 12,
    color: '#2D7A4F',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#8A8A8A',
    lineHeight: 22,
    marginBottom: 24,
  },
  includesGrid: {
    marginBottom: 32,
    gap: 10,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  includeDot: {
    fontSize: 14,
    color: '#E94560',
    fontWeight: '700',
  },
  includeText: {
    fontSize: 14,
    color: '#1A1A2E',
  },
  bookBtn: {
    backgroundColor: '#E94560',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});