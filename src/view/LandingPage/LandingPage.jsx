import React from "react";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaQrcode, FaWhatsapp, FaLaptop } from "react-icons/fa";
import "./LandingPage.css"; // Archivo CSS externo para las animaciones

const LandingPage = () => {
  return (
    <div>
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-6">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            {/* Logo SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="40"
              height="40"
              className="me-2"
            >
              <circle cx="50" cy="50" r="50" fill="#fd7e14" />
              <path
                d="M50 25c8 0 14 6 14 14 0 6-4 10-8 12 4 2 8 6 8 12 0 8-6 14-14 14s-14-6-14-14c0-6 4-10 8-12-4-2-8-6-8-12 0-8 6-14 14-14z"
                fill="#fff"
              />
              <path
                d="M50 35c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"
                fill="#343a40"
              />
              <line x1="50" y1="25" x2="50" y2="15" stroke="#fff" strokeWidth="2" />
              <line x1="50" y1="75" x2="50" y2="85" stroke="#fff" strokeWidth="2" />
              <line x1="64" y1="50" x2="74" y2="50" stroke="#fff" strokeWidth="2" />
              <line x1="36" y1="50" x2="26" y2="50" stroke="#fff" strokeWidth="2" />
              <text
                x="50"
                y="95"
                textAnchor="middle"
                fontSize="12"
                fontFamily="Arial, sans-serif"
                fill="#fff"
              >
                FlexiApp
              </text>
            </svg>
            FlexiApp
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" className="animated-btn text-light">
              Iniciar Sesión
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="animated-btn text-light">
              Registrarse
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(to right, #007bff, #6610f2)",
          color: "#fff",
          textAlign: "center",
          padding: "100px 20px",
        }}
      >
        <Container>
          <h1 className="mb-4">Bienvenido a FlexiApp</h1>
          <p className="lead mb-4">
            Gestiona tu negocio, personaliza tu tienda y envía pedidos a través de WhatsApp con nuestra plataforma.
          </p>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Lo que ofrecemos</h2>
        <Row>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaCalendarAlt size={50} className="text-primary mb-3" />
                <Card.Title>Sistemas de Citas Programados</Card.Title>
                <Card.Text>
                  Agenda y gestiona citas fácilmente para mejorar la organización de tu negocio.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaQrcode size={50} className="text-success mb-3" />
                <Card.Title>Carta Digital</Card.Title>
                <Card.Text>
                  Facilita a tus clientes el acceso a tu menú o catálogo con un código QR.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaWhatsapp size={50} className="text-warning mb-3" />
                <Card.Title>Tienda para Pedidos por WhatsApp</Card.Title>
                <Card.Text>
                  Permite a tus clientes realizar pedidos rápidamente desde WhatsApp con integración directa.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <FaLaptop size={50} className="text-info mb-3" />
                <Card.Title>Backoffice</Card.Title>
                <Card.Text>
                  Gestiona tus productos, personaliza tu tienda y controla tu negocio desde un solo lugar.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call to Action */}
      <div
        style={{
          backgroundColor: "#e9ecef",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <Container>
          <h2 className="mb-4">Empieza tu transformación digital</h2>
          <p className="lead mb-4">
            Lleva tu negocio al siguiente nivel con nuestra solución integral y fácil de usar.
          </p>
          <Button variant="primary" size="lg" as={Link} to="/register" className="animated-btn">
            Registrarme Ahora
          </Button>
        </Container>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#343a40",
          color: "#fff",
          padding: "20px 0",
          textAlign: "center",
        }}
      >
        <Container>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} FlexiApp. Todos los derechos reservados.
          </p>
          <p className="mb-0">
            <Nav.Link as={Link} to="/privacy" className="d-inline text-light">
              Política de Privacidad
            </Nav.Link>{" "}
            |{" "}
            <Nav.Link as={Link} to="/terms" className="d-inline text-light">
              Términos de Servicio
            </Nav.Link>
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;