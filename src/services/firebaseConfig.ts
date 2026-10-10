/**
 * Real Production Firebase Configuration & Initialization
 * Using Firebase Compat SDKs (v10.8.0)
 */

declare global {
  interface Window {
    firebase: any;
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export const firebaseConfig = {
  apiKey: "AIzaSyDnDWNsP-eqcDXEas_I1f7kGn11v5dkgcs",
  authDomain: "khetdrishti.firebaseapp.com",
  projectId: "khetdrishti",
  storageBucket: "khetdrishti.firebasestorage.app",
  messagingSenderId: "761439440813",
  appId: "1:761439440813:web:ac1be1a4ed8d55bf201b24",
  measurementId: "G-JNEZ0C1G4P"
};

// Singleton initialization
export function getFirebaseApp() {
  if (typeof window === 'undefined') return null;
  if (!window.firebase) {
    console.warn('Firebase compat SDK script not loaded yet');
    return null;
  }
  if (!window.firebase.apps || !window.firebase.apps.length) {
    try {
      return window.firebase.initializeApp(firebaseConfig);
    } catch (e) {
      console.error('Error initializing Firebase:', e);
      return null;
    }
  }
  return window.firebase.app();
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app && (!window.firebase || !window.firebase.auth)) return null;
  return window.firebase.auth();
}

export function getFirebaseFirestore() {
  const app = getFirebaseApp();
  if (!app && (!window.firebase || !window.firebase.firestore)) return null;
  return window.firebase.firestore();
}
