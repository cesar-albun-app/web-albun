import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContainerGallery from "../view/LoadingPage/ContainerGallery";
import HomeScreen from "../view/Home/HomeScreen";

function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ContainerGallery />} />
        <Route exact path="/home" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default RouterPage;
