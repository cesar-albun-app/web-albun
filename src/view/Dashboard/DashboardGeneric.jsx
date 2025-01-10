import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUpload, FaGlobe, FaClipboardList, FaCalendarAlt } from "react-icons/fa";

export default function DashboardGeneric({ domain }) {
  return (
    <>
    <Col md={3} className="mb-4">
      <Card
        className="h-100 shadow-sm"
        style={{
          backgroundColor: "#ffcf5c",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <FaUpload size={40} className="mb-3" style={{ color: "#fff" }} />
          <h6 className="text-center mb-3">Carga Productos</h6>
          <Button
            variant="light"
            as={Link}
         to="/genericRoute"
            style={{
              backgroundColor: "#fff",
              color: "#ffcf5c",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Cargar
          </Button>
        </Card.Body>
      </Card>
    </Col>

    <Col md={3} className="mb-4">
      <Card
        className="h-100 shadow-sm"
        style={{
          backgroundColor: "#5bc0de",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <FaGlobe size={40} className="mb-3" style={{ color: "#fff" }} />
          <h6 className="text-center mb-3">Web</h6>
          <Button
            variant="light"
            as={Link}
         to={`/${domain}`}
            style={{
              backgroundColor: "#fff",
              color: "#5bc0de",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Ir a Web
          </Button>
        </Card.Body>
      </Card>
    </Col>

    

    <Col md={3} className="mb-4">
      <Card
        className="h-100 shadow-sm"
        style={{
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <FaCalendarAlt size={40} className="mb-3" style={{ color: "#fff" }} />
          <h6 className="text-center mb-3">Gestiona Tu agenda</h6>
          <Button
            variant="light"
            as={Link}
            to="/schedulerGeneric" 
            style={{
              backgroundColor: "#fff",
              color: "#28a745",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Agenda
          </Button>
        </Card.Body>
      </Card>
    </Col>
  </>
  );
}



