import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { X, Search, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { fetchLocations } from '@/services/locationService';
import type { Location } from '@/services/locationService';

interface LocationPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  isFrom?: boolean;
}

export default function LocationPicker({
  isVisible,
  onClose,
  onSelectLocation,
  isFrom = true,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const fetchedLocations = await fetchLocations();
        setLocations(fetchedLocations);
        setFilteredLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = locations.filter((location: Location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchQuery, locations]);

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location.name);
    onClose();
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item)}
    >
      <MapPin size={18} color={isFrom ? Colors.primary : Colors.secondary} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        {item.region && (
          <Text style={styles.locationRegion}>{item.region}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isFrom ? 'From Where?' : 'To Where?'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={Colors.gray[700]} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.gray[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor={Colors.gray[500]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={Colors.gray[500]} />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading locations...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredLocations}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.locationsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No locations found</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: '75%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[900],
  },
  locationsList: {
    paddingHorizontal: 16,
  },
  locationItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  locationInfo: {
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[900],
  },
  locationRegion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
});
