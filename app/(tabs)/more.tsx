import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleHelp as HelpCircle, MessageSquare, Share2, Star, ShieldCheck, Info, BookOpen, Phone } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import Header from '@/components/core/Header';
import Colors from '@/constants/Colors';

export default function MoreScreen() {
  const router = useRouter();

  const sections = [
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={20} color={Colors.primary} />,
          title: 'Help & FAQ',
          onPress: () => router.push('/more/help'),
        },
        {
          id: 'contact',
          icon: <MessageSquare size={20} color={Colors.primary} />,
          title: 'Contact Us',
          onPress: () => router.push('/more/contact'),
        },
        {
          id: 'call',
          icon: <Phone size={20} color={Colors.primary} />,
          title: 'Call Support',
          onPress: () => Linking.openURL('tel:+251911234567'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'about',
          icon: <Info size={20} color={Colors.primary} />,
          title: 'About Mengedegna',
          onPress: () => router.push('/more/about'),
        },
        {
          id: 'terms',
          icon: <BookOpen size={20} color={Colors.primary} />,
          title: 'Terms & Conditions',
          onPress: () => router.push('/more/terms'),
        },
        {
          id: 'privacy',
          icon: <ShieldCheck size={20} color={Colors.primary} />,
          title: 'Privacy Policy',
          onPress: () => router.push('/more/privacy'),
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          id: 'rate',
          icon: <Star size={20} color={Colors.primary} />,
          title: 'Rate the App',
          onPress: () => Linking.openURL('https://play.google.com'),
        },
        {
          id: 'share',
          icon: <Share2 size={20} color={Colors.primary} />,
          title: 'Share App with Friends',
          onPress: () => {
            Linking.share({
              message: 'Check out Mengedegna, the best bus booking app in Ethiopia!',
              url: 'https://mengedegna.com',
            });
          },
        },
      ],
    },
  ];

  const renderSectionItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.item}
      onPress={item.onPress}
    >
      <View style={styles.itemIconContainer}>
        {item.icon}
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="More" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => renderSectionItem(item))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 Mengedegna. All rights reserved.</Text>
        </View>
      </ScrollView>
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[900],
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
});