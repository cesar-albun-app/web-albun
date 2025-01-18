import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import AdminScheduler from "./AdminScheduler";
import UserScheduler from "./UserScheduler";
import RequestedTurns from "./RequestedTurns";
import "../styles/SchedulerGeneric.css"

const SchedulerGeneric = ({ userData }) => {
  const { domain, logo, primaryColor, secondaryColor } = userData;

  const [activeTab, setActiveTab] = useState("admin");

  return (
    <Container className="scheduler-container">
      <h2 className="scheduler-title">Gestión de Turnos</h2>
      <Tabs
        activeKey={activeTab}
        onSelect={(tabKey) => setActiveTab(tabKey)}
        className="custom-tabs"
        justify
      >
        <Tab eventKey="admin" title="Administrador" className="tab-content">
          <AdminScheduler domain={domain} />
        </Tab>
        <Tab eventKey="user" title="Usuario" className="tab-content">
          <UserScheduler domain={domain} />
        </Tab>
        <Tab eventKey="requested" title="Turnos Solicitados" className="tab-content">
          <RequestedTurns domain={domain} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SchedulerGeneric;