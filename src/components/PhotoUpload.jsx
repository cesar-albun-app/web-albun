import React from "react";
import {  Row, Col, Card } from "react-bootstrap";

function PhotoUpload(props) {
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
      <Row className="justify-content-center">
        <Col md={6} lg={8}>
          <Card>
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title
                className="text-center"
                style={{
                  color: "black",
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                Bienvenidos, muchas gracias por colaborar. No hay plata para el
                fotógrafo.
              </Card.Title>
              {props.children}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PhotoUpload;
