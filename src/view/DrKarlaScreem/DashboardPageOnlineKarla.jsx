import React, { useState } from "react";
import { Card, Button, Col, Row, Container } from "react-bootstrap";
import { FaArrowLeft, FaCalendarAlt, FaShoppingBag } from "react-icons/fa";
import MobileProductScreen from './MobileProductScreen'
import UserScheduler from './Appointment/UserScheduler'

export default function DashboardPageOnlineKarla() {
  const [isRouterState, setIsRouterState] = useState(null);

  const cardStyles = {
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center",
    marginTop:"20px"
  };

  const buttonStyles = {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    padding: "8px 16px",
    fontSize: "0.9rem",
  };


;


  return (
    <>


{isRouterState !== null && (
        <div style={{ margin: "10px" }}>
          <Button
            variant="link"
            onClick={() => setIsRouterState(null)}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "black",
            }}
          >
            <FaArrowLeft size={20} style={{ marginRight: "8px" }} />
            Volver
          </Button>
        </div>
      )}



      {isRouterState === null ? (
        <>
          <Container>
      <Row className="g-4">
        {/* Card 1 */}
        <Col xs={12} md={6}>
          <Card
            className="shadow-sm h-100"
            style={{ ...cardStyles, backgroundColor: "#ffcf5c" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <FaShoppingBag size={50} className="mb-3" />
              <h6 className="mb-3" style={{ fontSize: "1rem" }}>
                Comprar Productos
              </h6>
              <Button
                style={{ ...buttonStyles, color: "#ffcf5c" }}
                onClick={() => setIsRouterState(false)}
              >
                Tienda
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 2 */}
        <Col xs={12} md={6}>
          <Card
            className="shadow-sm h-100"
            style={{ ...cardStyles, backgroundColor: "black" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <FaCalendarAlt size={50} className="mb-3" />
              <h6 className="mb-3" style={{ fontSize: "1rem" }}>
                Consulta Agenda
              </h6>
              <Button
                style={{ ...buttonStyles, color: "black" }}
                onClick={() => setIsRouterState(true)}
              >
                Agenda tu consulta
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
        </>
      ) : isRouterState ? (
        <UserScheduler />
      ) : (
        <MobileProductScreen />
      )}
    </>
  );
}
