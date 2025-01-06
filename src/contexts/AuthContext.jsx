import React, { createContext, useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase"; // Asegúrate de que Firebase esté configurado correctamente
import { collection, getDocs } from "firebase/firestore";
import { roleMappings } from "./AutRoles";

import {

  Spinner

} from "react-bootstrap";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState([]); // Estado para almacenar todos los usuarios
  
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
 await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(); // Obtén todos los registros de la colección users
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRole(null); // Limpia el rol al cerrar sesión
    setUserData([]); // Limpia los datos del usuario al cerrar sesión
  };

  // Lógica para determinar el rol basado en el correo
  const evaluateRole = (user) => {
    if (user?.email) {
      const email = user.email;
      return roleMappings[email] || "USER"; // Rol predeterminado si no está mapeado
    }
    return null;
  };

  const fetchUserData = async () => {
    try {
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);

      if (!querySnapshot.empty) {
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Incluye el ID del documento
          ...doc.data(), // Incluye los datos del documento
        }));
        setUserData(users); // Guarda todos los registros en el estado
      } else {
        console.warn("No se encontraron registros en la colección users.");
        setUserData([]); // Define como un array vacío si no hay registros
      }
    } catch (error) {
      console.error("Error al obtener los datos de usuarios:", error);
      setUserData([]); // En caso de error, define el estado como un array vacío
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setUserRole(evaluateRole(user)); // Evalúa el rol basado en el correo
        await fetchUserData(); // Obtén todos los registros de la colección users
      } else {
        setUserData([]); // Limpia el estado si no hay usuario
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userData, // Exponer userData
    login,
    logout,
  };

  if (loading) {
    return (

      <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <Spinner animation="border" variant="primary" />
      <p style={{ marginTop: "10px", fontSize: "1.2rem", color: "#6c63ff" }}>
        Ingresando...
      </p>
    </div>


    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};