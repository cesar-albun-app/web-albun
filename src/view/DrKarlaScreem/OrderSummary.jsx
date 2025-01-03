import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";

const OrderSummary = ({ cart, handleIncrement, handleDecrement, goBack, setCart}) => {
  const [name, setName] = useState(""); // Estado para el nombre del usuario
  const [isSubmitted, setIsSubmitted] = useState(false); // Estado para mostrar el mensaje de éxito

  // Calcular el total acumulado
  const totalAmount = cart.reduce(
    (acc, item) => acc + parseInt(item.amount) * item.quantity,
    0
  );

  // Generar mensaje para WhatsApp
  const generateWhatsAppMessage = () => {
    const itemsMessage = cart
      .map(
        (item) =>
          `- ${item.productName} x${item.quantity} = $${(
            item.quantity * parseInt(item.amount)
          ).toLocaleString()}`
      )
      .join("\n");
    return `Hola, soy ${name}. Me gustaría realizar el siguiente pedido:\n\n${itemsMessage}\n\nTotal: $${totalAmount.toLocaleString()}`;
  };

  // Función para enviar mensaje a WhatsApp
  const sendToWhatsApp = () => {
    const message = encodeURIComponent(generateWhatsAppMessage());
    const whatsappNumber = "5491173625934"; // Reemplaza con el número de WhatsApp
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappLink, "_blank");

    // Mostrar mensaje de éxito
    setIsSubmitted(true);

    // Limpiar el nombre y el carrito
    setName("");
    setCart([]); 
    setTimeout(() => {
      goBack(false); // Volver a la pantalla anterior después de un pequeño retraso
    }, 3000); // 1 segundo de retraso para mostrar el mensaje de éxito
  };

  return (
    <Container className="pt-4">
      {/* Encabezado */}
      <Row className="align-items-center mb-3">
        <Col xs={6}>
          <Button
            variant="link"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#333",
            }}
            onClick={() => goBack(false)} // Volver a la pantalla anterior
          >
            ← Atrás
          </Button>
        </Col>
        <Col xs={6} className="text-end">
          <span style={{ fontWeight: "bold", fontSize: "1rem" }}>Su carrito</span>
          <br />
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            ${totalAmount.toLocaleString()}
          </span>
        </Col>
      </Row>

      {/* Mensaje de éxito */}
      {isSubmitted && (
        <Alert variant="success" className="text-center">
          Pedido enviado exitosamente.
        </Alert>
      )}

      {/* Lista de productos */}
      <Row className="mb-4">
        {cart.map((item) => (
          <Col xs={12} className="mb-3" key={item.id}>
            <Row className="align-items-center">
              <Col xs={3}>
                <img
                  src={item.images[0]}
                  alt={item.productName}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={5}>
                <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                  {item.productName}
                </span>
                <br />
                <span style={{ fontSize: "0.9rem" }}>
                  ${parseInt(item.amount).toLocaleString()}
                </span>
              </Col>
              <Col xs={4} className="text-end">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100px",
                  }}
                >
                  {/* Botón de quitar */}
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleDecrement(item.id)}
                    style={{
                      borderRadius: "20%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0",
                    }}
                  >
                    -
                  </Button>
                  {/* Cantidad */}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.quantity}
                  </span>
                  {/* Botón de agregar */}
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleIncrement(item.id)}
                    style={{
                      borderRadius: "20%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0",
                    }}
                  >
                    +
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>

      {/* Nombre del usuario */}
      <Form.Group className="mb-4">
        <Form.Label>Ingresa tu nombre:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      {/* Solapa inferior */}
      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          zIndex: 1000,
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {cart.length} producto(s)
          </span>
          <br />
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            ${totalAmount.toLocaleString()}
          </span>
        </div>
        <Button
          variant="warning"
          style={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            borderRadius: "20px",
            padding: "10px 20px",
          }}
          onClick={sendToWhatsApp}
          disabled={!name} // Desactivar el botón si no hay nombre
        >
          Enviar al WS
        </Button>
      </div>
    </Container>
  );
};

export default OrderSummary;