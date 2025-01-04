import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import {roleMappings} from './AutRoles'

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserRole(null); // Limpia el rol al cerrar sesión
  };

  // Lógica para determinar el rol basado en el correo
  const evaluateRole = (user) => {
    if (user?.email) {
      const email = user.email;

      // Define roles dinámicamente
     
      // Si el correo no está mapeado, asigna "user" como rol por defecto
      return roleMappings[email] || "user";
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserRole(evaluateRole(user)); // Evalúa el rol basado en el correo del usuario
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole, // Exponer el rol en el contexto
    login,
    logout,
  };

  if (loading) {
    return <div>Cargando...</div>; // Pantalla de carga
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};