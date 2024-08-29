import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', height: '100vh' }}>
      <Row className="h-100">
        <Col md={3} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#007bff', color: 'white' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Home</h6>
              <Button variant="light" as={Link} to="/home">Home</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#28a745', color: 'white' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Finanzas</h6>
              <Button variant="light" as={Link} to="/FinancesScreen">Finanzas</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#ffc107', color: 'white' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Menú</h6>
              <Button variant="light" as={Link} to="/menu">Menú</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#dc3545', color: 'white' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h6>Carpetas</h6>
              <Button variant="light" as={Link} to="/DynamicCards">Carpetas</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;