import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Filter } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface TripFilterProps {
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function TripFilter({
  selectedFilter,
  onFilterChange,
}: TripFilterProps) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'price-low', label: 'Lowest Price' },
    { id: 'price-high', label: 'Highest Price' },
    { id: 'early', label: 'Early Departure' },
    { id: 'late', label: 'Late Departure' },
    { id: 'rating', label: 'Top Rated' },
  ];

  const handleFilterSelect = (filterId: string) => {
    onFilterChange(filterId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        <Filter size={16} color={Colors.gray[700]} />
        <Text style={styles.filterText}>Filter by:</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterOption,
              selectedFilter === filter.id && styles.selectedFilter,
            ]}
            onPress={() => handleFilterSelect(filter.id)}
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedFilter === filter.id && styles.selectedFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
  },
  filtersContainer: {
    paddingBottom: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.gray[100],
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
  },
  selectedFilterText: {
    color: Colors.white,
  },
});
