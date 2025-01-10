import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import AdminScheduler from "./AdminScheduler";
import UserScheduler from "./UserScheduler";
import RequestedTurns from "./RequestedTurns";

const SchedulerGeneric = (userData) => {
  const {domain,logo,primaryColor,secondaryColor}=userData.userData

  const [activeTab, setActiveTab] = useState("admin");

  return (
    <Container className="pt-4">
      <h2 className="text-center mb-4">Gestión de Turnos</h2>
      <Tabs
        activeKey={activeTab}
        onSelect={(tabKey) => setActiveTab(tabKey)}
        className="mb-4"
        justify
      >
        <Tab eventKey="admin" title="Administrador">
          <AdminScheduler domain={domain} />
        </Tab>
        <Tab eventKey="user" title="Usuario">
          <UserScheduler domain={domain} />
        </Tab>
        <Tab eventKey="requested" title="Turnos Solicitados">
          <RequestedTurns domain={domain} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SchedulerGeneric;