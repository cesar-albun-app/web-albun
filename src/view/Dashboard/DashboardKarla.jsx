import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUpload, FaGlobe, FaClipboardList, FaCalendarAlt } from "react-icons/fa";

export default function DashboardKarla() {
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
            <h6 className="text-center mb-3">Carga Data</h6>
            <Button
              variant="light"
              as={Link}
              to="/karlaScreem"
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
              to="/docKarla"
              target="_blank"
              rel="noopener noreferrer"
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
            backgroundColor: "#6f42c1",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <FaClipboardList
              size={40}
              className="mb-3"
              style={{ color: "#fff" }}
            />
            <h6 className="text-center mb-3">Consultas</h6>
            <Button
              variant="light"
              as={Link}
              to="/appointmentScheduler"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#fff",
                color: "#6f42c1",
                border: "none",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              Consultas
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
            <h6 className="text-center mb-3">Agenda</h6>
            <Button
              variant="light"
              as={Link}
              to="/scheduler"
              target="_blank"
              rel="noopener noreferrer"
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