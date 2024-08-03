// Dashboard.js
import React from 'react';
import { Card, Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', height: '100vh' }}>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <h5>Bienvenido</h5>
              <p>Tu albun de fotos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8} className="mb-4">
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h6>Likes</h6>
                  <h4>26,789</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h6>Love</h6>
                  <h4>6,754</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h6>Smiles</h6>
                  <h4>52,789</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={8} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h6>Fotos</h6>
                  <h4>1234</h4>
                  <div style={{ height: '200px', backgroundColor: '#f1f3f4' }}>
                    {/* Aquí podrías insertar un gráfico usando una librería como Chart.js */}
                  </div>
                  <Button as={Link} to="/home" variant="primary" className="mt-3">Ver mi home</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h6>Targets</h6>
                  <p>Views</p>
                  <ProgressBar now={75} label={`${75}%`} />
                  <p>Followers</p>
                  <ProgressBar now={50} label={`${50}%`} />
                  <p>Income</p>
                  <ProgressBar now={25} label={`${25}%`} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 bg-primary text-white">
            <Card.Body>
              <h6>Agregar Mas carpetas</h6>
              <Button variant="light" as={Link} to="/DynamicCards">Ir a Crear carpetas</Button>
            </Card.Body>
          </Card>
        </Col>
       
      </Row>
    </Container>
  );
}

export default Dashboard;
