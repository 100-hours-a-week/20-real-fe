import type { Analytics } from 'firebase/analytics';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDisKSrTCJWGZRpHg2E1o3Y5VkjDUVPRKE',
  authDomain: 'choon-assistant.firebaseapp.com',
  projectId: 'choon-assistant',
  storageBucket: 'choon-assistant.firebasestorage.app',
  messagingSenderId: '1080476865240',
  appId: '1:1080476865240:web:8ef250ca5f21b9b8edbdad',
  measurementId: 'G-2WLJSWR4H9',
};

const app = initializeApp(firebaseConfig);

export let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  });
}
