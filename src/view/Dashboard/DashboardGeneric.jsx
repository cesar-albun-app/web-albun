import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DashboardGeneric({ domain }) {
  return (
    <>
      <Col md={3} className="mb-4">
        <Card
          className="h-50"
          style={{ backgroundColor: "#ffc107", color: "white" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <h6>Carga Productos</h6>
            <Button variant="light" as={Link} to="/genericRoute">
              Cargar
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} className="mb-4">
        <Card
          className="h-50"
          style={{ backgroundColor: "black", color: "white" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <h6>Web de Productos y servicios</h6>
            <Button variant="light" as={Link} to={`/${domain}`}>
              Web
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
