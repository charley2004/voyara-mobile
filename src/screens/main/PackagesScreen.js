import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { packagesAPI } from '../../api/apiService';

export default function PackagesScreen({ navigation }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async (destination = '') => {
    try {
      setError('');
      const params = destination ? { destination } : {};
      const response = await packagesAPI.getAll(params);
      setPackages(response.data.data);
    } catch (err) {
      setError('Could not load packages. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchPackages(search.trim());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearch('');
    fetchPackages();
  };

  const renderPackage = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PackageDetail', { package: item })}
      activeOpacity={0.85}
    >
      {/* Color Banner */}
      <View style={styles.cardBanner}>
        <Text style={styles.cardDestination}>{item.destination}</Text>
        <Text style={styles.cardDuration}>{item.durationDays} days</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        {/* Includes Tags */}
        <View style={styles.tagsRow}>
          {item.includes?.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>from</Text>
            <Text style={styles.price}>
              ₦{item.price.toLocaleString()}
            </Text>
          </View>
          <View style={styles.slotsTag}>
            <Text style={styles.slotsText}>
              {item.availableSlots} slots left
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Packages</Text>
        <Text style={styles.subtitle}>Find your next adventure</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destination..."
          placeholderTextColor="#BBBBBB"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearch}
          activeOpacity={0.85}
        >
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A1A2E" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item._id}
          renderItem={renderPackage}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#1A1A2E"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No packages found.</Text>
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
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1A1A2E',
  },
  searchBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBanner: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDestination: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardDuration: {
    fontSize: 12,
    color: '#8A8A9A',
    fontWeight: '600',
  },
  cardBody: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F8F8F8',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  tagText: {
    fontSize: 11,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E94560',
  },
  slotsTag: {
    backgroundColor: '#F0FFF4',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  slotsText: {
    fontSize: 11,
    color: '#2D7A4F',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  errorText: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8A8A',
  },
});