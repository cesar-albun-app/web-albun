import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContainerGallery from "../view/LoadingPage/ContainerGallery";
import HomeScreen from "../view/Home/HomeScreen";
import Dashboard from "../view/Dashboard/Dashboard";
import DynamicCards from "../view/DynamicCards/DynamicCards";
import NotFound from "../view/NotFound/NotFound";
import FinancesScreen from "../view/Finanzas/FinancesScreen";
import FinancesYearGrapy from "../view/Finanzas/FinancesYearGrapy";
import TripsScreen from "../view/Trips/TripsScreen";

import UpdateImagesDubia from "../view/DubiaScreem/UpdateImagesDubia";
import UpdateImagesKarla from "../view/DrKarlaScreem/UpdateImagesKarla";
import UserPage from '../view/DrKarlaScreem/userPage/UserPage'

import MobileProductScreen from "../view/DubiaScreem/MobileProductScreen";
import DashboardPageOnlineKarla from "../view/DrKarlaScreem/DashboardPageOnlineKarla";
import DashboardPageOnline from "../view/GenericMobileScreen/DashboardPageOnline";
import UpdateImagesGeneric from "../view/GenericMobileScreen/UpdateImagesGeneric";
import SchedulerGeneric from "../view/GenericMobileScreen/Appointment/SchedulerGeneric";

import AppointmentScheduler from "../view/DrKarlaScreem/Appointment/AppointmentScheduler";
import Scheduler from "../view/DrKarlaScreem/Appointment/Scheduler";
import Register from "../view/Auth/Register";

import Login from "../view/Auth/Login";
import LandingPage from "../view/LandingPage/LandingPage";

import { AuthProvider, useAuth } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  const { userData, currentUser } = useAuth(); // Asegúrate de que useAuth se use dentro de AuthProvider

  const [dataUserFilter] = userData.filter(
    (as) => as.email === currentUser.email
  );

  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />

      <Route exact path="/Login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route
        exact
        path="/home"
        element={
          <PrivateRoute>
            <HomeScreen />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard userData={dataUserFilter} />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/FinancesScreen"
        element={
          <PrivateRoute>
            <FinancesScreen />
          </PrivateRoute>
        }
      />

      {/* DUBIA */}
      <Route
        exact
        path="/dubiaScreem"
        element={
          <PrivateRoute>
            <UpdateImagesDubia />
          </PrivateRoute>
        }
      />
      <Route exact path="/dubiaVentas" element={<MobileProductScreen />} />
      {/* KARLA */}

      <Route exact path="/docKarla" element={<DashboardPageOnlineKarla />} />
      <Route exact path="/userPageKarla" element={<UserPage />} />

      <Route
        exact
        path={"/karlaScreem"}
        element={
          <PrivateRoute>
            <UpdateImagesKarla />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/appointmentScheduler"
        element={
          <PrivateRoute>
            <AppointmentScheduler />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/scheduler"
        element={
          <PrivateRoute>
            <Scheduler />
          </PrivateRoute>
        }
      />

      {/* GERNRICOS */}

      <Route
        exact
        path={"/genericRoute"}
        element={
          <PrivateRoute>
            <UpdateImagesGeneric userData={dataUserFilter} />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path={`/schedulerGeneric`}
        element={
          <PrivateRoute>
            <SchedulerGeneric userData={dataUserFilter} />
          </PrivateRoute>
        }
      />

      {/* Rutas dinámicas generadas a partir de los dominios en `userData` */}
      {Array.isArray(userData) &&
        userData.map(
          (user) =>
            user.domain && (
              <>
                <Route
                  key={user.id} // Usar el ID como clave única
                  exact
                  path={`/${user.domain}`} // Ruta basada en el dominio
                  element={<
        
                    DashboardPageOnline userData={user} />} // Puedes pasar props dinámicos si lo necesitas
                />
              </>
            )
        )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function RouterPage() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default RouterPage;
