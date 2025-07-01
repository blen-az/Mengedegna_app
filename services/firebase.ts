// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  User,
  Auth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  connectAuthEmulator,
  initializeAuth,
  inMemoryPersistence,
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  connectFirestoreEmulator,
  Firestore,
  collection,
  addDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { Platform } from 'react-native';

// Type definitions
interface UserProfile {
  email: string;
  name?: string;
  phone?: string;
  role?: 'customer' | 'admin';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  id?: string;
}

interface Bus {
  busNumber: string;
  plateNumber: string;
  type: string;
  capacity: number;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  busId?: string;
}

interface Schedule {
  busId: string;
  routeId: string;
  departureDateTime: Date;
  arrivalDateTime?: Date;
  availableSeats: number;
  totalSeats: number;
  price: number;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  scheduleId?: string;
}

interface Route {
  origin: string;
  destination: string;
  distance?: number;
  estimatedDuration?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  routeId?: string;
}

interface Booking {
  userId: string;
  scheduleId: string;
  seatNumbers: string[];
  departureDateTime: Date;
  status: string;
  totalPrice: number;
  paymentId?: string;
  bookingDateTime?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  bookingId?: string;
}

interface Payment {
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  paidAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  paymentId?: string;
}

interface Notification {
  userId: string;
  message: string;
  type: string;
  relatedId?: string;
  isRead: boolean;
  createdAt?: Timestamp;
  notificationId?: string;
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
console.log('FIREBASE CONFIG:', firebaseConfig);

// Initialize Firebase
let app: ReturnType<typeof initializeApp>;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with proper persistence
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // Use inMemoryPersistence for React Native
    auth = initializeAuth(app, { persistence: inMemoryPersistence });
  }
  
  db = getFirestore(app);
  
  // Connect to emulators in development if using demo config
  if (__DEV__ && firebaseConfig.apiKey === 'demo-api-key') {
    try {
      if (Platform.OS === 'web') {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
    } catch (error) {
      console.log('Firebase emulators not available, using mock auth');
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a minimal mock auth object for error cases
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    app: {} as any,
    name: 'mock',
    config: {} as any,
    setPersistence: async () => {},
    useDeviceLanguage: () => {},
    settings: {} as any,
    tenantId: null,
    languageCode: null,
    signInAnonymously: async () => ({} as any),
    signInWithCredential: async () => ({} as any),
    signInWithCustomToken: async () => ({} as any),
    signInWithEmailAndPassword: async () => ({} as any),
    signInWithPhoneNumber: async () => ({} as any),
    signInWithPopup: async () => ({} as any),
    signInWithRedirect: async () => {},
    signOut: async () => {},
    updateCurrentUser: async () => {},
    verifyPasswordResetCode: async () => '',
    confirmPasswordReset: async () => {},
    applyActionCode: async () => {},
    checkActionCode: async () => ({} as any),
    createUserWithEmailAndPassword: async () => ({} as any),
    sendPasswordResetEmail: async () => {},
    sendSignInLinkToEmail: async () => {},
    isSignInWithEmailLink: () => false,
    useAuthEmulator: () => {},
    beforeAuthStateChanged: () => () => {},
    onIdTokenChanged: () => () => {},
    authStateReady: async () => ({} as any),
    emulatorConfig: null,
  } as unknown as Auth;
  db = {} as Firestore;
}

// User profile functions
export const createUserProfile = async (uid: string, userData: UserProfile): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() as UserProfile } : null;
};

export const updateUserProfile = async (uid: string, userData: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp(),
  });
};

// Bus functions
export const createBus = async (busData: Bus): Promise<string> => {
  const docRef = await addDoc(collection(db, 'buses'), {
    ...busData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(docRef, { busId: docRef.id }, { merge: true });
  return docRef.id;
};

// Schedule functions
export const createSchedule = async (scheduleData: Schedule): Promise<string> => {
  const docRef = await addDoc(collection(db, 'schedules'), {
    ...scheduleData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(docRef, { scheduleId: docRef.id }, { merge: true });
  return docRef.id;
};

// Route functions
export const createRoute = async (routeData: Route): Promise<string> => {
  const docRef = await addDoc(collection(db, 'routes'), {
    ...routeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(docRef, { routeId: docRef.id }, { merge: true });
  return docRef.id;
};

// Booking functions
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
    transaction.update(scheduleRef, {
      availableSeats: availableSeats - bookingData.seatNumbers.length,
      updatedAt: serverTimestamp(),
    });

    return bookingRef.id;
  });
};

// Payment functions
export const createPayment = async (paymentData: Payment): Promise<string> => {
  const docRef = await addDoc(collection(db, 'payments'), {
    ...paymentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(docRef, { paymentId: docRef.id }, { merge: true });
  return docRef.id;
};

// Notification functions
export const createNotification = async (notificationData: Notification): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    createdAt: serverTimestamp(),
  });
  await setDoc(docRef, { notificationId: docRef.id }, { merge: true });
  return docRef.id;
};

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
};

export const getAuthInstance = () => auth;