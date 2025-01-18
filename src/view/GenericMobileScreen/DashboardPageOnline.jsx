import React, { useState } from "react";
import { Card, Button, Col, Row, Container } from "react-bootstrap";
import { FaArrowLeft, FaCalendarAlt, FaShoppingBag } from "react-icons/fa";
import GenericMobileScreen from "./GenericMobileScreen";
import UserScheduler from "./Appointment/UserScheduler";
import './styles/DashboardPageOnline.css';


export default function DashboardPageOnline({ userData }) {
  const [isRouterState, setIsRouterState] = useState(null);

  const cardStyles = {
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center",
    marginTop: "20px",
  };

  const buttonStyles = {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    padding: "8px 16px",
    fontSize: "0.9rem",
  };

  return (
    <div className="DashboardPageOnline">
      {isRouterState !== null && (
        <div className="back-button">
          <Button variant="link" onClick={() => setIsRouterState(null)}>
            <FaArrowLeft size={20} className="me-2" />
            Volver
          </Button>
        </div>
      )}

      {isRouterState === null ? (
        <Container>
          <Row className="g-4 dashboard-cards">
            {/* Card 1 */}
            <Col xs={12} md={6}>
              <Card className="dashboard-card purple-card">
                <Card.Body>
                  <FaShoppingBag size={50} className="dashboard-icon" />
                  <h6 className="dashboard-title">Comprar Productos</h6>
                  <Button
                    className="dashboard-button purple-button"
                    onClick={() => setIsRouterState(false)}
                  >
                    Tienda
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 2 */}
            <Col xs={12} md={6}>
              <Card className="dashboard-card blue-card">
                <Card.Body>
                  <FaCalendarAlt size={50} className="dashboard-icon" />
                  <h6 className="dashboard-title">Consulta Agenda</h6>
                  <Button
                    className="dashboard-button blue-button"
                    onClick={() => setIsRouterState(true)}
                  >
                    Agenda tu consulta
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : isRouterState ? (
        <UserScheduler domain={userData?.domain} email={userData?.email} />
      ) : (
        <GenericMobileScreen userData={userData} />
      )}
    </div>
  );
}
