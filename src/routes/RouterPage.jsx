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

import UpdateImagesDubia from '../view/DubiaScreem/UpdateImagesDubia';
import UpdateImagesKarla from '../view/DrKarlaScreem/UpdateImagesKarla';

import MobileProductScreen from '../view/DubiaScreem/MobileProductScreen';
import MobileProductKarlaScreen from '../view/DrKarlaScreem/MobileProductScreen';
import AppointmentScheduler from '../view/DrKarlaScreem/Appointment/AppointmentScheduler';


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
          
          <Route exact path="/dubiaScreem" element={<PrivateRoute><UpdateImagesDubia /></PrivateRoute>} />
          <Route exact path="/dubiaVentas" element={<MobileProductScreen />} />
          
          <Route exact path="/docKarla" element={<MobileProductKarlaScreen />} />
          <Route exact path="/karlaScreem" element={<PrivateRoute><UpdateImagesKarla /></PrivateRoute>} />
          <Route exact path="/appointmentScheduler" element={<PrivateRoute><AppointmentScheduler /></PrivateRoute>} />



        
          
          <Route path="*" element={<NotFound />} />
          

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default RouterPage;
