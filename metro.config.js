const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure compatibility with React Native Reanimated and Worklets
config.resolver.alias = {
  'react-native-reanimated': require.resolve('react-native-reanimated'),
  'react-native-worklets': require.resolve('react-native-worklets'),
};

// Enable Flipper integration for debugging
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
