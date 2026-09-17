import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { bookingsAPI, paymentsAPI } from '../../api/apiService';

export default function BookingScreen({ route, navigation }) {
  const { package: pkg } = route.params;
  const [travellers, setTravellers] = useState('1');
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPrice = pkg.price * (parseInt(travellers) || 1);

  const handleBooking = async () => {
    if (!travelDate.trim()) {
      Alert.alert('Missing date', 'Please enter your travel date (YYYY-MM-DD)');
      return;
    }

    const numTravellers = parseInt(travellers);
    if (!numTravellers || numTravellers < 1) {
      Alert.alert('Invalid', 'Please enter a valid number of travellers');
      return;
    }

    if (numTravellers > pkg.availableSlots) {
      Alert.alert(
        'Not enough slots',
        `Only ${pkg.availableSlots} slots available`
      );
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create booking
      const bookingRes = await bookingsAPI.create({
        packageId: pkg._id,
        numberOfTravellers: numTravellers,
        travelDate,
      });

      const bookingId = bookingRes.data.data._id;

      // Step 2: Initiate payment
      const paymentRes = await paymentsAPI.initiate(bookingId);
      const { authorizationUrl } = paymentRes.data.data;

      // Step 3: Open Paystack payment page
      Alert.alert(
        'Proceed to Payment',
        `Your booking is ready. Total: ₦${totalPrice.toLocaleString()}. You will be redirected to Paystack to complete payment.`,
        [
          {
            text: 'Pay Now',
            onPress: () => Linking.openURL(authorizationUrl),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Book Package</Text>
        </View>

        {/* Package Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryDestination}>{pkg.destination}</Text>
          <Text style={styles.summaryTitle}>{pkg.title}</Text>
          <Text style={styles.summaryDuration}>{pkg.durationDays} days</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Booking details</Text>

          {/* Travellers */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Number of Travellers</Text>
            <TextInput
              style={styles.input}
              value={travellers}
              onChangeText={setTravellers}
              keyboardType="number-pad"
              placeholder="1"
              placeholderTextColor="#BBBBBB"
            />
          </View>

          {/* Travel Date */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Travel Date</Text>
            <TextInput
              style={styles.input}
              value={travelDate}
              onChangeText={setTravelDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#BBBBBB"
            />
            <Text style={styles.hint}>Format: 2026-06-15</Text>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Price per person</Text>
            <Text style={styles.priceRowValue}>
              ₦{pkg.price.toLocaleString()}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Travellers</Text>
            <Text style={styles.priceRowValue}>
              × {parseInt(travellers) || 1}
            </Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₦{totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookBtn, loading && styles.bookBtnDisabled]}
          onPress={handleBooking}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.bookBtnText}>
              Confirm & Pay ₦{totalPrice.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 14,
    color: '#8A8A8A',
    fontWeight: '600',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  summaryCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryDestination: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E94560',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryDuration: {
    fontSize: 13,
    color: '#8A8A9A',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A2E',
  },
  hint: {
    fontSize: 11,
    color: '#BBBBBB',
    marginTop: 4,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceRowLabel: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  priceRowValue: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E94560',
  },
  bookBtn: {
    backgroundColor: '#E94560',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bookBtnDisabled: {
    opacity: 0.6,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});