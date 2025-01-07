import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import AdminScheduler from "./AdminScheduler";
import UserScheduler from "./UserScheduler";

const Scheduler = () => {
  const [role, setRole] = useState("admin"); // Cambia entre "admin" y "user"

  return (
    <Container className="pt-4">
      <h2 className="text-center mb-4"> 
        
        
      {role === "admin" ? "Gestionar Tus Turnos" :"Turnos Disponibles"}
        
  </h2>
      <Button
        onClick={() => setRole((prev) => (prev === "admin" ? "user" : "admin"))}
        className="mb-4"
      >
        Cambiar a {role === "admin" ? "Usuario" : "Administrador"}
      </Button>

      {role === "admin" ? <AdminScheduler /> : <UserScheduler />}
    </Container>
  );
};

export default Scheduler;