import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import SearchBar from '@/components/core/SearchBar';
import OptimizedImage from '@/components/core/OptimizedImage';
import TripCard from '@/components/custom/TripCard';
import PromoBanner from '@/components/custom/PromoBanner';
import LocationPicker from '@/components/custom/LocationPicker';
import DatePicker from '@/components/custom/DatePicker';
import TripFilter from '@/components/custom/TripFilter';
import Colors from '@/constants/Colors';
import { fetchTrips, Trip as ServiceTrip } from '@/services/tripService';
import { getDestinations } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';

// Define types
interface Location {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  departureTerminal: string;
  price: number;
  availableSeats: number;
  company: {
    name: string;
    logoUrl: string;
    rating: number;
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPickingFrom, setIsPickingFrom] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Transform service trip data to component trip format
  const transformTrip = (serviceTrip: ServiceTrip): Trip => ({
    id: serviceTrip.id,
    from: serviceTrip.from,
    to: serviceTrip.to,
    date: serviceTrip.date,
    departureTime: '08:00', // Default departure time
    departureTerminal: 'Main Terminal', // Default terminal
    price: serviceTrip.price,
    availableSeats: serviceTrip.seatsAvailable,
    company: {
      name: 'Default Bus Company',
      logoUrl: 'https://example.com/logo.png',
      rating: 4.5,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [destinationsData, tripsData] = await Promise.all([
          getDestinations(),
          fetchTrips(),
        ]);
        setDestinations(destinationsData as Location[]);
        const transformedTrips = tripsData.map(transformTrip);
        setTrips(transformedTrips);
        setAllTrips(transformedTrips);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data if needed
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Combined filtering logic for search and filter
  const filteredTrips = useMemo(() => {
    let trips = [...allTrips];

    // Apply search filter
    if (debouncedSearchQuery.trim() !== '') {
      trips = trips.filter(
        (trip) =>
          (trip.from || '')
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          (trip.to || '')
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          (trip.company?.name || '')
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Apply additional filter
    switch (selectedFilter) {
      case 'price-low':
        trips = trips.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        trips = trips.sort((a, b) => b.price - a.price);
        break;
      case 'early':
        trips = trips.sort(
          (a, b) =>
            new Date(`1970-01-01T${a.departureTime}:00`).getTime() -
            new Date(`1970-01-01T${b.departureTime}:00`).getTime()
        );
        break;
      case 'late':
        trips = trips.sort(
          (a, b) =>
            new Date(`1970-01-01T${b.departureTime}:00`).getTime() -
            new Date(`1970-01-01T${a.departureTime}:00`).getTime()
        );
        break;
      case 'rating':
        trips = trips.sort(
          (a, b) => (b.company?.rating || 0) - (a.company?.rating || 0)
        );
        break;
      case 'all':
      default:
        // No additional filter
        break;
    }

    return trips;
  }, [debouncedSearchQuery, allTrips, selectedFilter]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update trips when filtered trips change
  useEffect(() => {
    setTrips(filteredTrips);
  }, [filteredTrips]);

  const handleSearch = async () => {
    if (fromLocation && toLocation) {
      try {
        const filteredTrips = await fetchTrips(
          fromLocation,
          toLocation,
          selectedDate.toISOString()
        );
        // Navigate to the first trip in the filtered results
        if (filteredTrips.length > 0) {
          router.push(`/trip/${filteredTrips[0].id}`);
        }
      } catch (error) {
        console.error('Error searching trips:', error);
      }
    }
  };

  const openLocationPicker = (isFrom = true) => {
    setIsPickingFrom(isFrom);
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (location: string) => {
    if (isPickingFrom) {
      setFromLocation(location);
    } else {
      setToLocation(location);
    }
    setShowLocationPicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const navigateToTripDetail = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  // Create sections for FlatList
  const sections: Array<{
    key: string;
    data: any[];
    renderItem: ({ item }: { item: any }) => React.JSX.Element | null;
  }> = [
    {
      key: 'header',
      data: [{}],
      renderItem: () => (
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.displayName || 'Guest'}
              </Text>
              <Text style={styles.subtitle}>Where are you going today?</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              accessibilityLabel="Go to profile"
              accessibilityHint="Navigate to your user profile page"
              accessibilityRole="button"
            >
              <OptimizedImage
                source={{
                  uri:
                    user?.photoURL ||
                    'https://www.dreamstime.com/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-image184816085',
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <SearchBar
            placeholder="Search destinations, buses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
        </View>
      ),
    },
    {
      key: 'search',
      data: [{}],
      renderItem: () => (
        <View style={styles.searchSection}>
          <View style={styles.searchCard}>
            <TouchableOpacity
              style={styles.locationPicker}
              onPress={() => openLocationPicker(true)}
              accessibilityLabel={`Select departure location, currently ${
                fromLocation || 'not selected'
              }`}
              accessibilityHint="Opens location picker to choose your starting point"
              accessibilityRole="button"
            >
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.locationText}>
                {fromLocation || 'From where?'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.locationPicker}
              onPress={() => openLocationPicker(false)}
              accessibilityLabel={`Select destination location, currently ${
                toLocation || 'not selected'
              }`}
              accessibilityHint="Opens location picker to choose your destination"
              accessibilityRole="button"
            >
              <MapPin size={18} color={Colors.secondary} />
              <Text style={styles.locationText}>
                {toLocation || 'To where?'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.datePicker}
              onPress={toggleDatePicker}
              accessibilityLabel={`Select travel date, currently ${selectedDate.toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              )}`}
              accessibilityHint="Opens date picker to choose your travel date"
              accessibilityRole="button"
            >
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              accessibilityLabel="Search for buses"
              accessibilityHint="Searches for available bus trips based on your selected locations and date"
              accessibilityRole="button"
            >
              <Text style={styles.searchButtonText}>Search Buses</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
    {
      key: 'promo',
      data: [{}],
      renderItem: () => (
        <PromoBanner
          title="Get 25% off on your first trip!"
          description="Use code FIRST25 at checkout"
          imageUrl="https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg"
        />
      ),
    },
    {
      key: 'destinations',
      data: [{}],
      renderItem: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {destinations.map((destination: Location) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => {
                  setToLocation(destination.name);
                  setFromLocation('Addis Ababa');
                  handleSearch();
                }}
                accessibilityLabel={`Select ${destination.name} as destination`}
                accessibilityHint={`Sets ${destination.name} as your destination and searches for trips from Addis Ababa`}
                accessibilityRole="button"
              >
                <OptimizedImage
                  source={{ uri: destination.imageUrl }}
                  style={styles.destinationImage}
                  resizeMode="cover"
                  placeholder="https://via.placeholder.com/180x120/cccccc/666666?text=No+Image"
                />
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <Text style={styles.destinationPrice}>
                    From {destination.price} ETB
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ),
    },
    {
      key: 'tripsHeader',
      data: [{}],
      renderItem: () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Trips</Text>
          <TripFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </View>
      ),
    },
    ...trips.map((trip) => ({
      key: `trip-${trip.id}`,
      data: [trip],
      renderItem: ({ item }: { item: Trip }) => (
        <TripCard trip={item} onPress={() => navigateToTripDetail(item.id)} />
      ),
    })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.renderItem({ item: item.data[0] })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        refreshing={loading}
        onRefresh={() => {
          setLoading(true);
          fetchTrips()
            .then((tripsData) => {
              const transformedTrips = tripsData.map(transformTrip);
              setAllTrips(transformedTrips);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }}
      />

      {showLocationPicker && (
        <LocationPicker
          isVisible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelectLocation={handleLocationSelect}
          isFrom={isPickingFrom}
        />
      )}

      {showDatePicker && (
        <DatePicker
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelectDate={handleDateSelect}
          selectedDate={selectedDate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  searchBar: {
    marginTop: 8,
  },
  searchSection: {
    marginTop: -30,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 8,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  horizontalScroll: {
    marginLeft: -4,
  },
  destinationCard: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationImage: {
    width: '100%',
    height: 120,
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  destinationPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
    marginTop: 4,
  },
  tripsList: {
    paddingBottom: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
