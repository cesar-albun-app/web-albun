import React from 'react'
import {
    Card,
    Button,
    Col,
 
  } from "react-bootstrap";
  import { Link } from "react-router-dom";

export default function DashboaDubia() {
  return (
    <>
    <Col md={3} className="mb-4">
      <Card
        className="h-50"
        style={{ backgroundColor: "#ffc107", color: "white" }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <h6>Dubia Carga</h6>
          <Button variant="light" as={Link} to="/dubiaScreem">
            Cargar
          </Button>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3} className="mb-4">
      <Card
        className="h-50"
        style={{ backgroundColor: "blue", color: "white" }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <h6>Dubia Web</h6>
          <Button
            variant="light"
            as={Link}
            to="/dubiaVentas"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web
          </Button>
        </Card.Body>
      </Card>
    </Col>
  </>
  )
}
