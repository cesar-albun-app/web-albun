import React from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Navbar,
  Nav,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Roles } from "../../constants/constants";
import DashboardKarla from "./DashboardKarla";
import DashboaDubia from "./DashboaDubia";
import DashboardGeneric from "./DashboardGeneric";

function Dashboard(userData) {

  const domain = userData?.userData?.domain || ""; // Valor predeterminado vacío

  const { logout, userRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirige al inicio de sesión después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <>
      {/* Header */}
      <Navbar
  bg="dark"
  variant="dark"
  expand="lg"
  className="mb-4"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 100, 
    
  }}
>
  <Container fluid>
    <Navbar.Brand as={Link} to="/dashboard">
      Dashboard
    </Navbar.Brand>
    <Nav className="ms-auto d-flex align-items-center">
      <span className="me-3 text-light">
        {currentUser.email} {/* Mostrar el correo del usuario */}
      </span>
      <Button variant="outline-light" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Nav>
  </Container>
</Navbar>

<Container
  fluid
  className="p-4"
  style={{
    backgroundColor: "#f8f9fa",
    height: "100vh",
    marginTop: "70px", // Despega el contenido del header (ajusta según la altura real del navbar)
  }}
>
  <Row className="h-100">
    {/* Mostrar todo si el rol es ADMIN */}
    {userRole === Roles.ADMIN && (
      <>
        <Col md={3} className="mb-4">
          <Card
            className="h-100"
            style={{ backgroundColor: "#007bff", color: "white" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Home</h6>
              <Button variant="light" as={Link} to="/home">
                Home
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card
            className="h-100"
            style={{ backgroundColor: "#28a745", color: "white" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Finanzas</h6>
              <Button variant="light" as={Link} to="/FinancesScreen">
                Finanzas
              </Button>
            </Card.Body>
            <Card.Body className="d-flex flex-column align-items-center">
              <h6>Graficos Mensual</h6>
              <Button variant="light" as={Link} to="/FinancesYearGrapy">
                Graficos Mensual
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </>
    )}

    {/* Mostrar solo para ADMIN o Roles.DUBIA */}
    {(userRole === Roles.ADMIN || userRole === Roles.DUBIA) && <DashboaDubia />}

    {(userRole === Roles.ADMIN || userRole === Roles.DRS) && <DashboardKarla />}

    {(userRole === Roles.ADMIN || userRole === Roles.USER) && (
      <DashboardGeneric domain={domain} />
    )}
  </Row>
</Container>
    </>
  );
}

export default Dashboard;
