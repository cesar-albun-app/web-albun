import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";

const ConfirmationModal = ({ show, setShow }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [show, setShow]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body className="text-center">
        <BsCheckCircle style={{ fontSize: "5rem", color: "green" }} />
        <h4 className="mt-3">¡Solicitud Confirmada!</h4>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;