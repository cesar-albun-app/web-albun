import React, { useState } from "react";
import { Form, Button, Container, Spinner, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db, storage } from "../../firebase"; // Ajusta la ruta según tu configuración
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    password: "",
    logo: null,
    domain: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  });
  const [previewLogo, setPreviewLogo] = useState(null); // Vista previa del logo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const [domainError, setDomainError] = useState(""); // Error para el dominio
  const [phoneError, setPhoneError] = useState(""); // Estado para el error del teléfono

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, logo: file });
        setPreviewLogo(URL.createObjectURL(file)); // Generar URL para vista previa
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateDomain = () => {
    const domainRegex = /^[a-z0-9-]+$/i; // Solo permite letras, números y guiones
    if (!formData.domain) {
      setDomainError("El dominio no puede estar vacío.");
      return false;
    }
    if (!domainRegex.test(formData.domain)) {
      setDomainError(
        "El dominio solo puede contener letras, números y guiones."
      );
      return false;
    }
    setDomainError("");
    return true;
  };

  const validatePhone = () => {
    const phoneRegex = /^549\d{6,}$/; // Validar que comience con 549 y tenga al menos 6 dígitos adicionales
    if (!formData.phone) {
      setPhoneError("El teléfono no puede estar vacío.");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError(
        "El teléfono debe comenzar con el código 549 seguido de al menos 6 dígitos adicionales."
      );
      return false;
    }
    setPhoneError("");
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores anteriores
    if (!validatePhone() || !validateDomain()) return; // Validar teléfono y dominio antes de continuar

    setLoading(true);

    const auth = getAuth();
    const usersCollection = collection(db, "users");

    try {
      // Crear usuario en Firebase Authentication
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Subir imagen (si existe) al Storage
      let logoUrl = "";
      if (formData.logo) {
        const storageRef = ref(storage, `logos/${user.uid}`);
        await uploadBytes(storageRef, formData.logo);
        logoUrl = await getDownloadURL(storageRef);
      }

      // Guardar datos adicionales en Firestore
      await addDoc(usersCollection, {
        uid: user.uid,
        firstName: formData.firstName,
        phone: formData.phone,
        email: formData.email,
        domain: formData.domain,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        logo: logoUrl,
        createdAt: new Date(),
      });

      alert("Registro exitoso.");
      navigate("/Login"); // Redirige al dashboard o donde desees
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está registrado.");
      } else {
        console.error("Error al registrar usuario:", error);
        setError("Hubo un problema al registrar el usuario. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f4f4f4" }}
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="px-4">
          <div
            className="p-4 shadow-lg"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <h2
              className="text-center mb-4"
              style={{ color: "#333", fontSize: "1.5rem" }}
            >
              Registro de Usuario
            </h2>
            {error && <p className="text-danger text-center">{error}</p>} {/* Mostrar mensaje de error */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                  required
                  style={{
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ejemplo: 549XXXXXXXXX"
                  required
                  style={{
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                />
                {phoneError && <p className="text-danger">{phoneError}</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  style={{
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crea una contraseña"
                  required
                  style={{
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Nombre del Dominio</Form.Label>
                <Form.Control
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="Ejemplo: minitienda"
                  required
                  style={{
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                />
                <Form.Text className="text-muted">
                  El nombre del dominio es el nombre con el cual enviarás a los usuarios para ver tu tienda.
                </Form.Text>
                {domainError && <p className="text-danger">{domainError}</p>}
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="text-muted">Color Primario</Form.Label>
                  <Form.Control
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label className="text-muted">Color Secundario</Form.Label>
                  <Form.Control
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                    }}
                  />
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Imagen de Perfil (Logo)</Form.Label>
                {previewLogo && (
                  <div className="mb-3 text-center">
                    <Image
                      src={previewLogo}
                      roundedCircle
                      alt="Vista previa del logo"
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  style={{
                    fontSize: "14px",
                    borderRadius: "5px",
                  }}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="dark"
                className="w-100"
                style={{
                  fontSize: "16px",
                  borderRadius: "5px",
                  backgroundColor: "#333",
                }}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Registrarse"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;