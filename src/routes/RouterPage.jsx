// src/RouterPage.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContainerGallery from '../view/LoadingPage/ContainerGallery';
import HomeScreen from '../view/Home/HomeScreen';
import Dashboard from '../view/Dashboard/Dashboard';
import DynamicCards from '../view/DynamicCards/DynamicCards';
import NotFound from '../view/NotFound/NotFound';
import FinancesScreen from '../view/Finanzas/FinancesScreen';
import FinancesYearGrapy from '../view/Finanzas/FinancesYearGrapy';
import TripsScreen from '../view/Trips/TripsScreen';





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
          <Route exact path="/FinancesScreen" element={<PrivateRoute><FinancesScreen /></PrivateRoute>} />
          <Route exact path="/FinancesYearGrapy" element={<PrivateRoute><FinancesYearGrapy /></PrivateRoute>} />
          <Route exact path="/TripsScreen" element={<PrivateRoute><TripsScreen /></PrivateRoute>} />
          

          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default RouterPage;
