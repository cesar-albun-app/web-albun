import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table, Modal } from "react-bootstrap";

const ArticleManager = ({ Categories,articles, setArticles }) => {
  const [articleName, setArticleName] = useState("");
  const [articlePrice, setArticlePrice] = useState("");
  const [articleCategory, setArticleCategory] = useState("");
  const [articleDescription, setArticleDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Índice del artículo en edición

  // Función para agregar o editar un artículo
  const handleAddOrEditArticle = () => {
    if (!articleName.trim() || !articlePrice.trim() || !articleCategory.trim()) {
      alert("Todos los campos obligatorios deben estar completos.");
      return;
    }

    // Validar si el precio es un número
    if (isNaN(parseFloat(articlePrice)) || parseFloat(articlePrice) <= 0) {
      alert("El precio debe ser un número mayor a 0.");
      return;
    }

    const newArticle = {
      name: articleName.trim(),
      price: parseFloat(articlePrice).toFixed(2),
      category: articleCategory.trim(),
      description: articleDescription.trim() || null,
    };

    if (editIndex !== null) {
      const updatedArticles = [...articles];
      updatedArticles[editIndex] = newArticle;
      setArticles(updatedArticles);
      setEditIndex(null);
    } else {
      setArticles([...articles, newArticle]);
    }

    setArticleName("");
    setArticlePrice("");
    setArticleCategory("");
    setArticleDescription("");
  };

  // Función para habilitar el modo edición
  const handleEditArticle = (index) => {
    const article = articles[index];
    setArticleName(article.name);
    setArticlePrice(article.price);
    setArticleCategory(article.category);
    setArticleDescription(article.description || "");
    setEditIndex(index);
  };

  // Función para eliminar un artículo
  const handleDeleteArticle = (index) => {
    const updatedArticles = articles.filter((_, i) => i !== index);
    setArticles(updatedArticles);
  };

  // Función para abrir/cerrar el modal
  const togglePreview = () => setShowPreview(!showPreview);

  return (
    <Container className="mt-4 container-custom">
      <Row>
        {/* Formulario para agregar o editar artículos */}
        <Col md={4} className="border p-3">
          <h4>{editIndex !== null ? "Editar Artículo" : "Agregar Artículo"}</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Artículo</Form.Label>
              <Form.Control
                type="text"
                value={articleName}
                placeholder="Escribe el nombre del artículo"
                onChange={(e) => setArticleName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                value={articlePrice}
                placeholder="Escribe el precio"
                onChange={(e) => setArticlePrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={articleCategory}
                onChange={(e) => setArticleCategory(e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {Categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={articleDescription}
                placeholder="Escribe una descripción (opcional)"
                onChange={(e) => setArticleDescription(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleAddOrEditArticle}>
              {editIndex !== null ? "Guardar Cambios" : "Agregar Artículo"}
            </Button>
          </Form>
        </Col>

        {/* Tabla para mostrar los artículos */}
        <Col md={8} className="border p-3">
          <h4>Listado de Artículos</h4>
          {articles.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre del Artículo</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{article.name}</td>
                    <td>${article.price}</td>
                    <td>{article.category}</td>
                    <td>{article.description || "N/A"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditArticle(index)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteArticle(index)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay artículos agregados.</p>
          )}

          {/* Botón para abrir el modal */}
          <Button variant="success" className="mt-3" onClick={togglePreview}>
            Vista Previa
          </Button>
        </Col>
      </Row>

      {/* Modal de Vista Previa */}
      <Modal show={showPreview} onHide={togglePreview} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vista Previa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {articles.length > 0 ? (
              <div>
                {Categories.map((category) => (
                  <div key={category} style={{ marginBottom: "15px" }}>
                    <h4
                      style={{
                        textDecoration: "underline",
                        marginTop: "20px",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {category}
                    </h4>
                    <ul style={{ padding: "0" }}>
                      {articles
                        .filter((article) => article.category === category)
                        .map((filteredArticle, index) => (
                          <li
                            key={index}
                            style={{
                              padding: "10px 0",
                              borderBottom: "1px solid #fff",
                              listStyle: "none",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>{filteredArticle.name}</span>
                              <span>${filteredArticle.price}</span>
                            </div>
                            {filteredArticle.description && (
                              <div
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#ccc",
                                  marginTop: "5px",
                                  fontStyle: "italic",
                                }}
                              >
                                {filteredArticle.description}
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay artículos para mostrar.</p>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ArticleManager;