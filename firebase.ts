import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCwqRkL8WFxn_Aubry-z2E2jYHU-exh4U",
  authDomain: "olio-4ac6d.firebaseapp.com",
  projectId: "olio-4ac6d",
  storageBucket: "olio-4ac6d.firebasestorage.app",
  messagingSenderId: "182571556319",
  appId: "1:182571556319:web:c371acc5a5ad33798f386a"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firestore
export const db = getFirestore(app);

// Inizializza Auth
export const auth = getAuth(app);
