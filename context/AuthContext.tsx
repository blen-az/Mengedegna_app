import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAuthInstance,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from '@/services/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: any;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth || !auth.onAuthStateChanged) {
      setIsInitialized(true); // Mock initialization for development
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: FirebaseUser | null) => {
        setIsLoading(true);
        if (firebaseUser) {
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          setUser(user);
          setIsAuthenticated(true);
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            setUserProfile(profile);
          } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data.');
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
        setIsInitialized(true);
        setIsLoading(false);
      }
    );

    // Handle redirect result for web
    if (Platform.OS === 'web') {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            const user: User = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            };
            setUser(user);
            setIsAuthenticated(true);
            createUserProfile(result.user.uid, {
              email: result.user.email || '',
              name: result.user.displayName || '',
            });
          }
        })
        .catch((err) => {
          console.error('Redirect error:', err);
          setError('Authentication redirect failed.');
        });
    }

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      if (!auth || !signInWithEmailAndPassword) {
        const mockUser: User = {
          uid: 'mock-id',
          email,
          displayName: 'Mock',
          photoURL: null,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      if (!auth || !createUserWithEmailAndPassword) {
        const mockUser: User = {
          uid: 'mock-id',
          email,
          displayName: fullName,
          photoURL: null,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return;
      }
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: fullName });
      await createUserProfile(user.uid, {
        email,
        name: fullName,
        role: 'user',
      });
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        photoURL: user.photoURL,
      });
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      if (!auth || !GoogleAuthProvider) {
        const mockUser: User = {
          uid: 'mock-google-id',
          email: 'user@gmail.com',
          displayName: 'Google User',
          photoURL: 'https://example.com/photo.jpg',
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return;
      }
      const provider = new GoogleAuthProvider();
      let result;
      if (Platform.OS === 'web') {
        await signInWithRedirect(auth, provider);
      } else {
        result = await signInWithPopup(auth, provider);
        if (result.user) {
          await createUserProfile(result.user.uid, {
            email: result.user.email || '',
            name: result.user.displayName || '',
            role: 'user',
          });
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
          setIsAuthenticated(true);
        }
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      if (!auth || !signOut) {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        return;
      }
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Logout failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfileData = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user found');
      if (updateProfile) {
        await updateProfile(currentUser, {
          displayName: data.name,
          photoURL: data.photoURL,
        });
      }
      await updateUserProfile(currentUser.uid, data);
      const updatedProfile = await getUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);
      setUser((prev) =>
        prev
          ? { ...prev, displayName: data.name, photoURL: data.photoURL }
          : null
      );
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'Profile update failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    login,
    register,
    signInWithGoogle,
    logout,
    updateUserProfile: updateUserProfileData,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
