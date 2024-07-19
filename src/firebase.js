// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBcnehKVfhGyibk9w2Bw8RwfvJD1WKE5G4",
    authDomain: "albun-app.firebaseapp.com",
    projectId: "albun-app",
    storageBucket: "albun-app.appspot.com",
    messagingSenderId: "752725821784",
    appId: "1:752725821784:web:d48cbf4ef3b03a26263d2d",
    measurementId: "G-KKLDHRHJ0B"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
