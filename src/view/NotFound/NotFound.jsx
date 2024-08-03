// src/view/NotFound/NotFound.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container style={{ marginTop: 100, padding: 20 }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="p-4 shadow-lg text-center">
            <Card.Body>
              <h2 className="mb-4">404 - Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
              <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
