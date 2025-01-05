import React from 'react'
import {
    Card,
    Button,
    Col,
 
  } from "react-bootstrap";
  import { Link } from "react-router-dom";

export default function DashboardKarla() {
  return (
    <>
  
    <Col md={3} className="mb-4">
    <Card
      className="h-50"
      style={{ backgroundColor: "#ffc107", color: "white" }}
    >
      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <h6>Carga Data</h6>
        <Button variant="light" as={Link} to="/karlaScreem">
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
        <h6>Web</h6>
        <Button
          variant="light"
          as={Link}
          to="/docKarla"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web
        </Button>
      </Card.Body>
    </Card>
  </Col>
  <Col md={3} className="mb-4">
    <Card
      className="h-50"
      style={{ backgroundColor: "#9188c2", color: "white" }}
    >
      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <h6>Consultas</h6>
        <Button
          variant="light"
          as={Link}
          to="/appointmentScheduler"
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultas
        </Button>
      </Card.Body>
    </Card>
    
  </Col>
  <Col md={3} className="mb-4">
    <Card
      className="h-50"
      style={{ backgroundColor: "#9188c2", color: "white" }}
    >
      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <h6>Agenda</h6>
        <Button
          variant="light"
          as={Link}
          to="/scheduler"
          target="_blank"
          rel="noopener noreferrer"
        >
          Agenda
        </Button>
      </Card.Body>
    </Card>
    
  </Col>
  </>
  )
}
