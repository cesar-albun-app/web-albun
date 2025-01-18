import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlOa5kLtL00LlnfFYUiGUq-Eyd9sVFBkk",
  authDomain: "flexiappprod.firebaseapp.com",
  projectId: "flexiappprod",
  storageBucket: "flexiappprod.firebasestorage.app",
  messagingSenderId: "151937755130",
  appId: "1:151937755130:web:12a79bf68cc99572d9a643",
  measurementId: "G-0PMZKTPM68"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Configuración de persistencia de sesión
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistencia configurada en LOCAL.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia: ", error);
  });

export { db, storage, auth };