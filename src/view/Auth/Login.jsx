import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para manejar el spinner
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Mostrar el spinner

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.log("error: ", error);
      setError("Error debes agregar email y password");
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <Container style={{ marginTop: 100, padding: 20 }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="p-4 shadow-lg login-card">
            <Card.Body>
              <h2 className="text-center mb-4 login-title">Ingresar</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingrese Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="login-button"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Ingresando...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;