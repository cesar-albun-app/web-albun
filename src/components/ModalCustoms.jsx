import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ModalCustoms({ 
  show, 
  handleClose, 
  handleDelete, 
  title, 
  subtitle, 
  primaryButtonLabel, 
  secondaryButtonLabel 
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{subtitle}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {secondaryButtonLabel}
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          {primaryButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCustoms;
