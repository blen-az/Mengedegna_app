import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  style?: ViewStyle;
}

export default function SearchBar({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  style,
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View style={[styles.container, style]}>
      <Search size={20} color={Colors.gray[500]} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[500]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel={`Search input, ${placeholder}`}
        accessibilityHint="Type to search for destinations, buses, or companies"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <X size={16} color={Colors.gray[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});
