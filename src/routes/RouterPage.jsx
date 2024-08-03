// src/RouterPage.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContainerGallery from '../view/LoadingPage/ContainerGallery';
import HomeScreen from '../view/Home/HomeScreen';
import Dashboard from '../view/Dashboard/Dashboard';
import DynamicCards from '../view/DynamicCards/DynamicCards';
import NotFound from '../view/NotFound/NotFound';

import Login from '../view/Auth/Login';
import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';

function RouterPage() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route exact path="/" element={<Login />} />
          <Route exact path="/gordiboda" element={<ContainerGallery />} />
          <Route exact path="/home" element={<PrivateRoute><HomeScreen /></PrivateRoute>} />
          <Route exact path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route exact path="/dynamicCards" element={<PrivateRoute><DynamicCards /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default RouterPage;
