import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, signInWithGoogle } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      fullName: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      general: '' 
    };

    // Full name validation
    if (!fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(email, password, fullName);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        general: 'Failed to register. This email may already be in use.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Google signup error:', error);
      setErrors({
        ...errors,
        general: error.code === 'auth/popup-blocked' 
          ? 'Pop-up blocked. Please allow pop-ups for this site in your browser settings and try again.'
          : 'Failed to sign up with Google. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicators
  const passwordHasMinLength = password.length >= 6;
  const passwordHasLetter = /[a-zA-Z]/.test(password);
  const passwordHasNumber = /[0-9]/.test(password);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.gray[800]} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {errors.general ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputContainer, errors.fullName ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.gray[400]}
                  autoCapitalize="words"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              {errors.fullName ? <Text style={styles.errorMessage}>{errors.fullName}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.gray[400]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {errors.email ? <Text style={styles.errorMessage}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={Colors.gray[400]}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.gray[500]} />
                  ) : (
                    <Eye size={20} color={Colors.gray[500]} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorMessage}>{errors.password}</Text>
              ) : (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthIndicator}>
                    <View style={[
                      styles.strengthItem, 
                      passwordHasMinLength && styles.strengthValid
                    ]}>
                      {passwordHasMinLength && <Check size={12} color={Colors.white} />}
                    </View>
                    <Text style={styles.strengthText}>At least 6 characters</Text>
                  </View>
                  <View style={styles.strengthIndicator}>
                    <View style={[
                      styles.strengthItem, 
                      passwordHasLetter && styles.strengthValid
                    ]}>
                      {passwordHasLetter && <Check size={12} color={Colors.white} />}
                    </View>
                    <Text style={styles.strengthText}>Contains a letter</Text>
                  </View>
                  <View style={styles.strengthIndicator}>
                    <View style={[
                      styles.strengthItem, 
                      passwordHasNumber && styles.strengthValid
                    ]}>
                      {passwordHasNumber && <Check size={12} color={Colors.white} />}
                    </View>
                    <Text style={styles.strengthText}>Contains a number</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={Colors.gray[400]}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.gray[500]} />
                  ) : (
                    <Eye size={20} color={Colors.gray[500]} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorMessage}>{errors.confirmPassword}</Text> : null}
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={handleGoogleSignup}
              disabled={loading}
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text 
                style={styles.loginLink}
                onPress={() => router.push('/login')}
              >
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[900],
  },
  eyeIcon: {
    padding: 8,
  },
  errorMessage: {
    color: Colors.error,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  passwordStrength: {
    marginTop: 8,
  },
  strengthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  strengthItem: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.gray[200],
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strengthValid: {
    backgroundColor: Colors.success,
  },
  strengthText: {
    color: Colors.gray[600],
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[200],
  },
  dividerText: {
    color: Colors.gray[500],
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    height: 56,
    backgroundColor: Colors.white,
  },
  googleButtonText: {
    color: Colors.gray[800],
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
  },
  footerText: {
    color: Colors.gray[600],
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    backgroundColor: Colors.error + '15',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});