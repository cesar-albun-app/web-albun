import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUpload, FaGlobe, FaCalendarAlt,FaUserAlt,FaMagento } from "react-icons/fa";
import styles from "./style/DashboardGeneric.module.css"; // Importar estilos como módulo CSS

export default function DashboardGeneric({ domain }) {
  return (
    <>
      <Col md={4} className={`mb-4 ${styles.cardCol}`}>
        <Card className={`${styles.dashboardCard} ${styles.yellowCard}`}>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <FaUpload size={40} className={styles.dashboardIcon} />
            <h6 className={styles.dashboardTitle}>Carga Productos</h6>
            <Button
              className={`${styles.dashboardButton} ${styles.yellowButton}`}
              as={Link}
              to="/genericRoute"
            >
              Cargar
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4} className={`mb-8 ${styles.cardCol}`}>
        <Card className={`${styles.dashboardCard} ${styles.blueCard}`}>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <FaGlobe size={40} className={styles.dashboardIcon} />
            <h6 className={styles.dashboardTitle}>Web</h6>
            <Button
              className={`${styles.dashboardButton} ${styles.blueButton}`}
              as={Link}
              to={`/${domain}`}
            >
              Ir a Web
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4} className={`mb-4 ${styles.cardCol}`}>
        <Card className={`${styles.dashboardCard} ${styles.greenCard}`}>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <FaCalendarAlt size={40} className={styles.dashboardIcon} />
            <h6 className={styles.dashboardTitle}>Gestiona Tu Agenda</h6>
            <Button
              className={`${styles.dashboardButton} ${styles.greenButton}`}
              as={Link}
              to="/schedulerGeneric"
            >
              Agenda
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className={`mb-4 ${styles.cardCol}`}>
        <Card className={`${styles.dashboardCard} ${styles.greenCard}`}>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <FaUserAlt size={40} className="mb-3" style={{ color: "#fff" }} />
          <h6 className={styles.dashboardTitle}>Agenda de Pacientes</h6>
            <Button
              className={`${styles.dashboardButton} ${styles.greenButton}`}
              as={Link}
              to="/userAccount"
            >
              Pacientes
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className={`mb-4 ${styles.cardCol}`}>
        <Card className={`${styles.dashboardCard} ${styles.blackCard}`}>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <FaMagento size={40} className="mb-3" style={{ color: "red" }} />
          <h6 className={styles.dashboardTitle}>Gestionar Menu </h6>
            <Button
              className={`${styles.dashboardButton} ${styles.blackBtn}`}
              as={Link}
              to="/dashboardMenu"
            >
              Menu
            </Button>
          </Card.Body>
        </Card>
      </Col>

      
    </>
  );
}

