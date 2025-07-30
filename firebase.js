import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7EKa8BKnoh1cWc-huaWbriCTy-Wta7jM",
  authDomain: "habittracker-977ba.firebaseapp.com",
  projectId: "habittracker-977ba",
  storageBucket: "habittracker-977ba.firebasestorage.app",
  messagingSenderId: "578442562905",
  appId: "1:578442562905:web:0d9acaf684db6f8524d048"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
