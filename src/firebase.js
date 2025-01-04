import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBcnehKVfhGyibk9w2Bw8RwfvJD1WKE5G4",
    authDomain: "albun-app.firebaseapp.com",
    projectId: "albun-app",
    storageBucket: "albun-app.appspot.com",
    messagingSenderId: "752725821784",
    appId: "1:752725821784:web:d48cbf4ef3b03a26263d2d",
    measurementId: "G-KKLDHRHJ0B"
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