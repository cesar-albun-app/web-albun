import React from "react";
import {  Card, Button, Container, Row, Col, Navbar, Nav  } from "react-bootstrap";
import { Link ,useNavigate} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


function Dashboard() {


  const { logout } = useAuth();
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
<Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
<Container fluid>
  <Navbar.Brand as={Link} to="/dashboard">Dashboard</Navbar.Brand>
  <Nav className="ms-auto">
    <Button variant="outline-light" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  </Nav>
</Container>
</Navbar>

    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f8f9fa", height: "100vh" }}
    >
      <Row className="h-100">
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
        <Col md={3} className="mb-4">
          <Card
            className="h-100"
            style={{ backgroundColor: "#ffc107", color: "white" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Carga Imagenes Dubia</h6>
              <Button variant="light" as={Link} to="/dubiaScreem">
                Cargar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card
            className="h-100"
            style={{ backgroundColor: "#9188c2", color: "white" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Carga Imagenes Karla</h6>
              <Button variant="light" as={Link} to="/karlaScreem">
                Cargar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card
            className="h-100"
            style={{ backgroundColor: "#9188c2", color: "white" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Viajes</h6>
              <Button variant="light" as={Link} to="/TripsScreen">
              Viajes
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card
            className="h-100"
            style={{ backgroundColor: "#dc3545", color: "white" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Carpetas</h6>
              <Button variant="light" as={Link} to="/DynamicCards">
                Carpetas
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default Dashboard;
