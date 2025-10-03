import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  connectAuthEmulator,
} from 'firebase/auth';
import { 
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  connectFirestoreEmulator,
  collection,
  addDoc,
  runTransaction,
  Timestamp,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions (unchanged)
interface UserProfile { email: string; name?: string; phone?: string; role?: 'user' | 'admin' | 'operator'; createdAt?: Timestamp; updatedAt?: Timestamp; id?: string; }
interface Bus { busNumber: string; plateNumber: string; type: string; capacity: number; status: string; createdAt?: Timestamp; updatedAt?: Timestamp; busId?: string; }
interface Schedule { busId: string; routeId: string; departureDateTime: Date; arrivalDateTime?: Date; availableSeats: number; totalSeats: number; price: number; status: string; createdAt?: Timestamp; updatedAt?: Timestamp; scheduleId?: string; }
interface Route { origin: string; destination: string; distance?: number; estimatedDuration?: number; createdAt?: Timestamp; updatedAt?: Timestamp; routeId?: string; }
interface Booking { userId: string; scheduleId: string; seatNumbers: string[]; departureDateTime: Date; status: string; totalPrice: number; paymentId?: string; bookingDateTime?: Timestamp; createdAt?: Timestamp; updatedAt?: Timestamp; bookingId?: string; }
interface Payment { bookingId: string; userId: string; amount: number; paymentMethod: string; status: string; transactionId?: string; paidAt?: Timestamp; createdAt?: Timestamp; updatedAt?: Timestamp; paymentId?: string; }
interface Notification { userId: string; message: string; type: string; relatedId?: string; isRead: boolean; createdAt?: Timestamp; notificationId?: string; }

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
console.log('FIREBASE CONFIG:', firebaseConfig);

const app = initializeApp(firebaseConfig);

// Initialize auth with proper persistence for React Native
let authInstance: any;
try {
  if (Platform.OS !== 'web') {
    // For React Native, try to use AsyncStorage persistence
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('Firebase Auth initialized with AsyncStorage persistence');
  } else {
    authInstance = getAuth(app);
    console.log('Firebase Auth initialized for web');
  }
} catch (error) {
  // Fallback to default auth if AsyncStorage persistence fails
  console.log('Falling back to default auth:', error);
  authInstance = getAuth(app);
}

// Ensure auth is properly initialized
if (!authInstance) {
  console.log('Auth instance not available, using fallback');
  authInstance = getAuth(app);
}

const db = getFirestore(app);

// Set persistence for React Native
// Note: Web SDK handles persistence automatically

// Emulator setup for development
if (__DEV__ && firebaseConfig.apiKey === 'demo-api-key') {
  try {
    if (Platform.OS === 'web') {
      connectAuthEmulator(authInstance, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
    } else {
      // React Native emulator setup would go here if using RN Firebase
      console.log('Emulator setup for React Native not implemented');
    }
  } catch (error) {
    console.log('Emulators not available, using production');
  }
}

// User profile functions
export const createUserProfile = async (uid: string, userData: UserProfile): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    role: userData.role || "user", // default role
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() as UserProfile } : null;
};

export const updateUserProfile = async (uid: string, userData: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { ...userData, updatedAt: serverTimestamp() });
};

// Other functions (createBus, createSchedule, etc.) remain unchanged
export const createBus = async (busData: Bus): Promise<string> => {
  const docRef = await addDoc(collection(db, 'buses'), { ...busData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(docRef, { busId: docRef.id }, { merge: true });
  return docRef.id;
};

export const createSchedule = async (scheduleData: Schedule): Promise<string> => {
  const docRef = await addDoc(collection(db, 'schedules'), { ...scheduleData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(docRef, { scheduleId: docRef.id }, { merge: true });
  return docRef.id;
};

export const createRoute = async (routeData: Route): Promise<string> => {
  const docRef = await addDoc(collection(db, 'routes'), { ...routeData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(docRef, { routeId: docRef.id }, { merge: true });
  return docRef.id;
};

export const createBooking = async (bookingData: Booking): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    const scheduleRef = doc(db, 'schedules', bookingData.scheduleId);
    const scheduleSnap = await transaction.get(scheduleRef);
    if (!scheduleSnap.exists()) throw new Error('Schedule does not exist');
    const { availableSeats } = scheduleSnap.data() as Schedule;
    if (availableSeats < bookingData.seatNumbers.length) throw new Error('Not enough available seats');
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      bookingDateTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    transaction.set(bookingRef, { bookingId: bookingRef.id }, { merge: true });
    transaction.update(scheduleRef, { availableSeats: availableSeats - bookingData.seatNumbers.length, updatedAt: serverTimestamp() });
    return bookingRef.id;
  });
};

export const createPayment = async (paymentData: Payment): Promise<string> => {
  const docRef = await addDoc(collection(db, 'payments'), { ...paymentData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await setDoc(docRef, { paymentId: docRef.id }, { merge: true });
  return docRef.id;
};

export const createNotification = async (notificationData: Notification): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notifications'), { ...notificationData, createdAt: serverTimestamp() });
  await setDoc(docRef, { notificationId: docRef.id }, { merge: true });
  return docRef.id;
};

// Community posts functions
export const createPost = async (postData: any): Promise<string> => {
  const docRef = await addDoc(collection(db, 'posts'), { 
    ...postData, 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  await setDoc(docRef, { postId: docRef.id }, { merge: true });
  return docRef.id;
};

export const getPosts = async (): Promise<any[]> => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePostLikes = async (postId: string, userId: string, liked: boolean): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, { 
    [`likes.${userId}`]: liked,
    updatedAt: serverTimestamp()
  });
};

export { authInstance as auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult };
export const getAuthInstance = () => authInstance;

// Destinations functions
export const getDestinations = async () => {
  const destinationsRef = collection(db, 'destinations');
  const q = query(destinationsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
