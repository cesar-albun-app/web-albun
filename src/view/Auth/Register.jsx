import React, { useState } from "react";
import { Form, Button, Container, Spinner, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db, storage } from "../../firebase"; // Ajusta la ruta según tu configuración
import { getFirestore, collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import "./Register.css";

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
    profileType: "EMP", // "EMP" por defecto (Emprendimiento)

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
  
    // Validar teléfono y dominio antes de continuar
    if (!validatePhone() || !validateDomain()) return;
  
    setLoading(true);
  
    const auth = getAuth();
  
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
  
      // Crear referencia al documento del usuario (debe tener un número par de segmentos)
      const userDocRef = doc(db, `applicationsBase/users/use`, user.uid);
  
      // Guardar datos adicionales en el documento del usuario
      await setDoc(userDocRef, {
        uid: user.uid,
        firstName: formData.firstName,
        phone: formData.phone,
        email: formData.email,
        domain: formData.domain,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        logo: logoUrl,
        createdAt: new Date(),
        profileType: formData.profileType, // Guardar como "EMP" o "SAL"

      });
  
      // Crear una referencia a la subcolección "orders"
      const ordersCollectionRef = collection(userDocRef, "orders");
  
      // Agregar un documento inicial a la subcolección
      const initialOrder = {
        orderName: "Welcome Package",
        description: "Initial setup for new user",
        createdAt: new Date(),
      };
  
      await addDoc(ordersCollectionRef, initialOrder);
  
      alert("Registro exitoso.");
      navigate("/Login"); // Redirige al login o donde desees
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
    <Container className="d-flex justify-content-center align-items-center vh-100">
    <Row className="justify-content-center w-100">
      <Col xs={12} sm={8} md={6} lg={4}>
        <div className="register-card">
          <h2 className="register-title">Registro de Usuario</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="register-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ejemplo: 549XXXXXXXXX"
                className="register-input"
                required
              />
              {phoneError && <p className="text-danger">{phoneError}</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
                className="register-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                className="register-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Dominio</Form.Label>
              <Form.Control
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="Ejemplo: minitienda"
                className="register-input"
                required
              />
              {domainError && <p className="text-danger">{domainError}</p>}
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Label>Color Primario</Form.Label>
                <Form.Control
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="register-color-picker"
                />
              </Col>
              <Col>
                <Form.Label>Color Secundario</Form.Label>
                <Form.Control
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="register-color-picker"
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Imagen de Perfil (Logo)</Form.Label>
              {previewLogo && (
                <Image
                  src={previewLogo}
                  alt="Vista previa del logo"
                  className="register-preview-logo"
                />
              )}
              <Form.Control
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                className="register-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Selecciona tu perfil</Form.Label>
  <Form.Select
    name="profileType"
    value={formData.profileType}
    onChange={handleChange}
    className="register-input"
    required
  >
    <option value="EMP">Tengo un Emprendimiento</option>
    <option value="SAL">Soy Personal de Salud</option>
  </Form.Select>
</Form.Group>
            <Button type="submit" className="register-button" disabled={loading}>
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