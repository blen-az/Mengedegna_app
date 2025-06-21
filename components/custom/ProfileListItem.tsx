import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ProfileListItemProps {
  item: {
    id: string;
    icon: React.ReactNode;
    title: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  };
}

export default function ProfileListItem({ item }: ProfileListItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={item.onPress}
      disabled={!item.onPress}
    >
      <View style={styles.icon}>{item.icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.rightContainer}>
        {item.rightElement ? (
          item.rightElement
        ) : item.onPress ? (
          <ChevronRight size={20} color={Colors.gray[400]} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  icon: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[900],
  },
  rightContainer: {
    marginLeft: 8,
  },
});