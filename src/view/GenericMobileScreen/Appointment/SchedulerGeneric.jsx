import React, { useState } from "react";
import { Container, Tabs, Tab, Button } from "react-bootstrap";
import AdminScheduler from "./AdminScheduler";
import UserScheduler from "./UserScheduler";
import RequestedTurns from "./RequestedTurns";
import "../styles/SchedulerGeneric.css";

const SchedulerGeneric = ({ userData }) => {
  const { domain } = userData;
  const [activeTab, setActiveTab] = useState("admin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="scheduler-container">
      {/* Botón para el menú lateral */}
      <div
        className={`menu-toggle-button ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menú lateral */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="menu-list">
          <li onClick={() => setActiveTab("admin")}>Administrador</li>
          <li onClick={() => setActiveTab("user")}>Usuario</li>
          <li onClick={() => setActiveTab("requested")}>Turnos Solicitados</li>
          <li onClick={() => window.history.back()}>Salir</li> {/* Opción de Salir */}

          
        </ul>
      </div>

      {/* Contenido principal */}
      <Container>
        <h2 className="scheduler-title">Gestión de Turnos</h2>
        <Tabs
          activeKey={activeTab}
          onSelect={(tabKey) => setActiveTab(tabKey)}
          className="custom-tabs"
          justify
        >
          <Tab eventKey="admin" title="Administrador">
            <div className="tab-content">
              <AdminScheduler domain={domain} />
            </div>
          </Tab>
          <Tab eventKey="user" title="Usuario">
            <div className="tab-content">
              <UserScheduler domain={domain} />
            </div>
          </Tab>
          <Tab eventKey="requested" title="Turnos Solicitados">
            <div className="tab-content">
              <RequestedTurns domain={domain} />
            </div>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default SchedulerGeneric;