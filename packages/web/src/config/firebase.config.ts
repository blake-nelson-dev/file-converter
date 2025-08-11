// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { env, shouldUseEmulators } from "./env.validation";

// Use validated environment configuration
const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  // Only include measurementId if it's provided (not empty)
  ...(env.firebase.measurementId && env.firebase.measurementId.trim() !== '' && { 
    measurementId: env.firebase.measurementId 
  })
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators if configured
if (shouldUseEmulators()) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    console.info('Connected to Firebase emulators');
  } catch (error) {
    // Emulators already connected or not available
    console.log('Firebase emulators connection status:', error);
  }
}

export default app;