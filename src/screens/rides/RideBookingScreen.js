import React, { useState, useCallback } from 'react';
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
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ridesAPI } from '../../api/apiService';
import { Linking } from 'react-native';



const VEHICLE_TYPES = [
  { key: 'sedan',  label: 'Sedan',  price: '₦5,000',  desc: 'Up to 4 passengers' },
  { key: 'suv',    label: 'SUV',    price: '₦8,000',  desc: 'Up to 6 passengers' },
  { key: 'van',    label: 'Van',    price: '₦12,000', desc: 'Up to 10 passengers' },
  { key: 'luxury', label: 'Luxury', price: '₦20,000', desc: 'Premium experience' },
];

const STATUS_COLORS = {
  pending:   { bg: '#FFF8E1', text: '#F59E0B' },
  confirmed: { bg: '#F0FFF4', text: '#2D7A4F' },
  cancelled: { bg: '#FFF0F0', text: '#E94560' },
  completed: { bg: '#F0F4FF', text: '#3B5BDB' },
};

export default function RideBookingScreen() {
  // ── Tab State ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('book');

  // ── Booking Form State ─────────────────────────────────────
  const [form, setForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    rideDate: '',
    vehicleType: 'sedan',
    numberOfPassengers: '1',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  // ── My Rides State ─────────────────────────────────────────
  const [rides, setRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Fetch rides every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMyRides();
    }, [])
  );

  const fetchMyRides = async () => {
    try {
      const response = await ridesAPI.getMyRides();
      setRides(response.data.data);
    } catch (error) {
      console.error('Fetch rides error:', error);
    } finally {
      setRidesLoading(false);
      setRefreshing(false);
    }
  };

  const handleBookRide = async () => {
    if (!form.pickupLocation.trim() || !form.dropoffLocation.trim() || !form.rideDate.trim()) {
      Alert.alert('Missing fields', 'Please fill in pickup, dropoff and date.');
      return;
    }

    setLoading(true);
    try {
      const response = await ridesAPI.book({
        ...form,
        numberOfPassengers: parseInt(form.numberOfPassengers) || 1,
      });

      Alert.alert(
        'Ride Booked!',
        `Your ${form.vehicleType} has been booked. Total: ₦${response.data.data.price.toLocaleString()}`,
        [{
          text: 'View My Rides',
          onPress: () => {
            setForm({
              pickupLocation: '',
              dropoffLocation: '',
              rideDate: '',
              vehicleType: 'sedan',
              numberOfPassengers: '1',
              notes: '',
            });
            setActiveTab('rides');
            fetchMyRides();
          },
        }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not book ride');
    } finally {
      setLoading(false);
    }
  };

 const renderRide = ({ item }) => {
  const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.pending;

  const handlePayRide = async () => {
    try {
      const response = await paymentsAPI.initiateRide(item._id);
      const { authorizationUrl } = response.data.data;

      Alert.alert(
        'Proceed to Payment',
        `Complete payment of ₦${item.price.toLocaleString()} for your ride.`,
        [
          {
            text: 'Pay Now',
            onPress: () => Linking.openURL(authorizationUrl),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not initiate payment');
    }
  };

  return (
    <View style={styles.rideCard}>
      <View style={styles.rideCardHeader}>
        <Text style={styles.rideVehicle}>{item.vehicleType.toUpperCase()}</Text>
        <View style={[styles.statusTag, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.routeDot} />
        <Text style={styles.routeText} numberOfLines={1}>
          {item.pickupLocation}
        </Text>
      </View>
      <View style={styles.routeLine} />
      <View style={styles.routeRow}>
        <View style={[styles.routeDot, styles.routeDotEnd]} />
        <Text style={styles.routeText} numberOfLines={1}>
          {item.dropoffLocation}
        </Text>
      </View>

      <View style={styles.rideFooter}>
        <Text style={styles.rideDate}>
          {new Date(item.rideDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </Text>
        <Text style={styles.ridePrice}>₦{item.price.toLocaleString()}</Text>
      </View>

      {/* Pay button — only show if pending */}
      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePayRide}
          activeOpacity={0.85}
        >
          <Text style={styles.payBtnText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rides</Text>
        <Text style={styles.subtitle}>Airport transfers & city rides</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'book' && styles.tabActive]}
          onPress={() => setActiveTab('book')}
        >
          <Text style={[styles.tabText, activeTab === 'book' && styles.tabTextActive]}>
            Book a Ride
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rides' && styles.tabActive]}
          onPress={() => setActiveTab('rides')}
        >
          <Text style={[styles.tabText, activeTab === 'rides' && styles.tabTextActive]}>
            My Rides
          </Text>
        </TouchableOpacity>
      </View>

      {/* Book Tab */}
      {activeTab === 'book' && (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Route */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Pickup Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Murtala Mohammed Airport"
                placeholderTextColor="#BBBBBB"
                value={form.pickupLocation}
                onChangeText={(v) => updateField('pickupLocation', v)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Dropoff Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Victoria Island, Lagos"
                placeholderTextColor="#BBBBBB"
                value={form.dropoffLocation}
                onChangeText={(v) => updateField('dropoffLocation', v)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Ride Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#BBBBBB"
                value={form.rideDate}
                onChangeText={(v) => updateField('rideDate', v)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Passengers</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor="#BBBBBB"
                value={form.numberOfPassengers}
                onChangeText={(v) => updateField('numberOfPassengers', v)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Vehicle Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Vehicle</Text>
            <View style={styles.vehicleGrid}>
              {VEHICLE_TYPES.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.key}
                  style={[
                    styles.vehicleCard,
                    form.vehicleType === vehicle.key && styles.vehicleCardActive,
                  ]}
                  onPress={() => updateField('vehicleType', vehicle.key)}
                  activeOpacity={0.85}
                >
                  <Text style={[
                    styles.vehicleLabel,
                    form.vehicleType === vehicle.key && styles.vehicleLabelActive,
                  ]}>
                    {vehicle.label}
                  </Text>
                  <Text style={[
                    styles.vehiclePrice,
                    form.vehicleType === vehicle.key && styles.vehiclePriceActive,
                  ]}>
                    {vehicle.price}
                  </Text>
                  <Text style={styles.vehicleDesc}>{vehicle.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="e.g. Flight lands at 3pm, please wait at arrivals"
              placeholderTextColor="#BBBBBB"
              value={form.notes}
              onChangeText={(v) => updateField('notes', v)}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.bookBtn, loading && styles.bookBtnDisabled]}
            onPress={handleBookRide}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.bookBtnText}>Book Ride</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* My Rides Tab */}
      {activeTab === 'rides' && (
        ridesLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1A1A2E" />
          </View>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item) => item._id}
            renderItem={renderRide}
            contentContainerStyle={styles.ridesList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => { setRefreshing(true); fetchMyRides(); }}
                tintColor="#1A1A2E"
              />
            }
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No rides booked yet.</Text>
                <TouchableOpacity onPress={() => setActiveTab('book')}>
                  <Text style={styles.emptyLink}>Book your first ride</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  tabActive: {
    backgroundColor: '#1A1A2E',
    borderColor: '#1A1A2E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 14,
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
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vehicleCard: {
    width: '47%',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F8F8F8',
  },
  vehicleCardActive: {
    borderColor: '#1A1A2E',
    backgroundColor: '#1A1A2E',
  },
  vehicleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  vehicleLabelActive: {
    color: '#FFFFFF',
  },
  vehiclePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E94560',
    marginBottom: 4,
  },
  vehiclePriceActive: {
    color: '#FF8A9A',
  },
  vehicleDesc: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  bookBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
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
  ridesList: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideVehicle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 1,
  },
  statusTag: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A1A2E',
  },
  routeDotEnd: {
    backgroundColor: '#E94560',
  },
  routeLine: {
    width: 1,
    height: 16,
    backgroundColor: '#EFEFEF',
    marginLeft: 3.5,
    marginVertical: 4,
  },
  routeText: {
    fontSize: 13,
    color: '#1A1A2E',
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  rideDate: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  ridePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E94560',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyLink: {
    fontSize: 13,
    color: '#E94560',
    fontWeight: '600',
  },


payBtn: {
  backgroundColor: '#E94560',
  borderRadius: 50,
  paddingVertical: 12,
  alignItems: 'center',
  marginTop: 12,
},
payBtnText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '700',
},

});

