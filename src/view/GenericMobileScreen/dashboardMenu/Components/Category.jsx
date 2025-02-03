import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import "../../styles/SubCategory.css";

const Category = ({categories, setCategories,menuTitle,setMenuTitle, logoUrl,setLogoUrl,handleLogoChange,
  previewButtonColor, setPreviewButtonColor,previewBackgroundColor, setPreviewBackgroundColor,previewTextColor, setPreviewTextColor,colorBtText, setColorBtText
}) => {
  const [category, setCategory] = useState("");
  const [showPreview, setShowPreview] = useState(false);



  // Función para agregar una categoría
  const handleAddCategory = () => {
    if (!category.trim()) {
      alert("La categoría no puede estar vacía.");
      return;
    }
    if (categories.includes(category.trim())) {
      alert("La categoría ya existe.");
      return;
    }
    setCategories([...categories, category.trim()]);
    setCategory(""); // Limpiar el campo
  };

  // Función para eliminar una categoría
  const handleDeleteCategory = (categoryToDelete) => {
    const filteredCategories = categories.filter(
      (cat) => cat !== categoryToDelete
    );
    setCategories(filteredCategories);
  };

;

  // Función para abrir/cerrar la vista previa
  const togglePreview = () => setShowPreview(!showPreview);

  return (
    <Container className="mt-4 container-custom">
      {/* Sección del logo y título */}
      <Row className="text-center mb-4">
        <Col>
          <img src={logoUrl} alt="Logo" className="logo" />
          <Form.Group className="mt-3">
            <Form.Control
              type="text"
              value={menuTitle}
              onChange={(e) => setMenuTitle(e.target.value)}
              className="text-center title-input"
              placeholder="Escribe un título"
            />
          </Form.Group>
          <div style={{width:'40%'}}>

    
          <Form.Group className="mt-3">
            <Form.Label>Subir Logo</Form.Label>
            <Form.Control type="file" onChange={handleLogoChange} />
          </Form.Group>
          </div>
        </Col>
      </Row>

      {/* Personalización de colores (solo para la vista previa) */}
      <Row>
        <Col md={4}>
          <Form.Group>
            <Form.Label >Color de Fondo (Vista Previa)</Form.Label>
            <Form.Control
              type="color"
              value={previewBackgroundColor}
              onChange={(e) => setPreviewBackgroundColor(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Color de los Botones (Vista Previa)</Form.Label>
            <Form.Control
              type="color"
              value={previewButtonColor}
              onChange={(e) => setPreviewButtonColor(e.target.value)}
            />
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group>
            <Form.Label>Color del Texto (Vista Previa)</Form.Label>
            <Form.Control
              type="color"
              value={previewTextColor}
              onChange={(e) => setPreviewTextColor(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Color del Texto de los Botones (Vista Previa)</Form.Label>
            <Form.Control
              type="color"
              value={colorBtText}
              onChange={(e) => setColorBtText(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Primera Sección */}
        <Col md={4} className="border p-3">
          <h4>Agregar Categoría</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Categoría</Form.Label>
              <Form.Control
                type="text"
                value={category}
                placeholder="Escribe una categoría"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddCategory}>
              Agregar
            </Button>
          </Form>
        </Col>

        {/* Segunda Sección */}
        <Col md={8} className="border p-3">
          {categories.length > 0 ? (
            <div className="category-buttons">
              {categories.map((cat, index) => (
                <Button
                  key={index}
                  variant="outline-dark"
                  className="category-button"
                  onClick={()=>handleDeleteCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          ) : (
            <p>No hay categorías agregadas.</p>
          )}
        </Col>
      </Row>

      {/* Botón de Vista Previa */}
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="success" onClick={togglePreview}>
            Vista Previa
          </Button>
        </Col>
      </Row>

      {/* Modal de Vista Previa */}
      <Modal show={showPreview} onHide={togglePreview} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Vista Previa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: previewBackgroundColor }}>
          <div className="text-center">
            <img src={logoUrl} alt="Logo" className="logo-preview" />
            <h2
              className="menu-title-preview"
              style={{ color: previewTextColor }}
            >
              {menuTitle}
            </h2>
            <div className="category-preview">
              {categories.map((cat, index) => (
                <Button
                  key={index}
                  style={{
                    backgroundColor: previewButtonColor,
                    color: colorBtText,
                    border: "none",
                  }}
                  className="preview-category-button hover-effect"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Category;