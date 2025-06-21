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
  updateUserProfile
} from '@/services/firebase';

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
  register: (email: string, password: string, fullName: string) => Promise<void>;
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
      // Mock auth for development
      setIsInitialized(true);
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
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
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      
      setIsInitialized(true);
    });

    if (Platform.OS === 'web') {
      getRedirectResult(auth).then((result) => {
        if (result?.user) {
          const user: User = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };
          setUser(user);
          setIsAuthenticated(true);
        }
      }).catch((error) => {
        console.error('Redirect result error:', error);
        setError('Failed to complete authentication. Please try again.');
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
        // Mock login for development
        const mockUser: User = {
          uid: 'mock-user-id',
          email,
          displayName: 'Mock User',
          photoURL: null,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      if (!auth || !createUserWithEmailAndPassword) {
        // Mock registration for development
        const mockUser: User = {
          uid: 'mock-user-id',
          email,
          displayName: fullName,
          photoURL: null,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return;
      }
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, { displayName: fullName });
      
      await createUserProfile(user.uid, {
        email,
        fullName,
        photoURL: user.photoURL,
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
      throw error;
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
        // Mock Google sign in for development
        const mockUser: User = {
          uid: 'mock-google-user-id',
          email: 'user@gmail.com',
          displayName: 'Google User',
          photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return;
      }
      
      const provider = new GoogleAuthProvider();
      
      if (Platform.OS === 'web') {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await createUserProfile(result.user.uid, {
            email: result.user.email,
            fullName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
        }
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
      throw error;
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
        // Mock logout for development
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        return;
      }
      
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Failed to logout. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfileData = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      const currentUser = auth?.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update auth profile
      if (updateProfile) {
        await updateProfile(currentUser, {
          displayName: data.fullName,
          photoURL: data.photoURL,
        });
      }

      // Update Firestore profile
      await updateUserProfile(currentUser.uid, data);
      
      // Update local state
      setUserProfile((prev: any) => ({ ...prev, ...data }));
      
    } catch (error: any) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
      throw error;
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