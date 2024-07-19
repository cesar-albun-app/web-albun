import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PhotoGalleryOpener from '../PhotoGalleryOpener';

function PhotoUpload() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={8}>
          <Card>
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title 
                className="text-center" 
                style={{ color: '#8A2BE2', fontSize: '1.5rem', marginBottom: '20px' }}
              >
                Bienvenidos, muchas gracias por colaborar. No hay plata para el fotógrafo.
              </Card.Title>
              <PhotoGalleryOpener />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PhotoUpload;
