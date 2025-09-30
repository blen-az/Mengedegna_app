import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }

    // Start animations
    logoOpacity.value = withSpring(1, { damping: 15 });
    titleOpacity.value = withDelay(300, withSpring(1, { damping: 15 }));
    subtitleOpacity.value = withDelay(600, withSpring(1, { damping: 15 }));
    buttonOpacity.value = withDelay(900, withSpring(1, { damping: 15 }));
  }, [
    isAuthenticated,
    router,
    logoOpacity,
    titleOpacity,
    subtitleOpacity,
    buttonOpacity,
  ]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoOpacity.value }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: (1 - titleOpacity.value) * 20 }],
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [{ translateY: (1 - subtitleOpacity.value) * 20 }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateY: (1 - buttonOpacity.value) * 20 }],
    };
  });

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg',
        }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/10227099/pexels-photo-10227099.jpeg',
            }}
            style={styles.logo}
          />
        </Animated.View>

        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          Mengedegna
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
          Your journey, our priority
        </Animated.Text>

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push('/register')}
          >
            <Text style={[styles.buttonText, styles.registerButtonText]}>
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.skipButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  registerButtonText: {
    color: Colors.white,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.white,
    opacity: 0.8,
  },
});
