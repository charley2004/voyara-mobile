import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bookingsAPI } from '../../api/apiService';

const STATUS_COLORS = {
  pending:   { bg: '#FFF8E1', text: '#F59E0B' },
  confirmed: { bg: '#F0FFF4', text: '#2D7A4F' },
  cancelled: { bg: '#FFF0F0', text: '#E94560' },
};

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // useFocusEffect refetches every time this tab is opened
  // So after paying, coming back here shows updated status
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderBooking = ({ item }) => {
    const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.pending;

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.destination}>
            {item.package?.destination || 'Unknown'}
          </Text>
          <View style={[styles.statusTag, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.packageTitle}>
          {item.package?.title || 'Package'}
        </Text>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Travellers</Text>
            <Text style={styles.detailValue}>{item.numberOfTravellers}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Travel Date</Text>
            <Text style={styles.detailValue}>
              {new Date(item.travelDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={[styles.detailValue, styles.price]}>
              ₦{item.totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Paid At */}
        {item.paidAt && (
          <Text style={styles.paidAt}>
            Paid on {new Date(item.paidAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>Your booking history</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A1A2E" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchBookings(); }}
              tintColor="#1A1A2E"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No bookings yet.</Text>
              <Text style={styles.emptySubText}>
                Browse packages to plan your first trip.
              </Text>
            </View>
          }
        />
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
    paddingBottom: 12,
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
  list: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  destination: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E94560',
    textTransform: 'uppercase',
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
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  price: {
    color: '#E94560',
  },
  paidAt: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 12,
    textAlign: 'right',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
  },
});