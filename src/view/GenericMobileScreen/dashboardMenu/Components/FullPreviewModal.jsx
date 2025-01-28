import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const FullPreviewModal = ({
  showPreview,
  togglePreview,
  menuTitle,
  logoUrl,
  previewButtonColor,
  previewBackgroundColor,
  previewTextColor,
  colorBtText,
  categories,
  articles,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la categoría seleccionada

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Establecer la categoría seleccionada
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null); // Regresar a la vista de categorías
  };

  const getFilteredCategories = () => {
    return categories.filter((cat) =>
      articles.some((article) => article.category === cat)
    );
  };

  return (
    <Modal
      show={showPreview}
      onHide={togglePreview}
      centered
      size="xl" // Cambiamos el tamaño del modal a extra grande
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>
          {selectedCategory
            ? selectedCategory === "Todos"
              ? "Todos los Artículos"
              : `Carta: ${selectedCategory}`
            : "Vista Previa Completa"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: previewBackgroundColor }}>
        {/* Contenido del Logo y Título */}
        <div className="text-center">
          <img src={logoUrl} alt="Logo" className="logo-preview" />
          <h2
            className="menu-title-preview"
            style={{ color: previewTextColor, fontFamily: "Georgia, serif" }}
          >
            {menuTitle}
          </h2>
        </div>

        {/* Mostrar categorías o artículos según el estado */}
        {selectedCategory ? (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#000",
              color: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleBackToCategories}
              style={{ marginBottom: "10px", width: "20%" }}
            >
              Volver a Categorías
            </Button>

            {/* Mostrar título de la categoría seleccionada */}
            <h3
              style={{
                textAlign: "center",
                color: previewTextColor,
                marginBottom: "20px",
                fontFamily: "Georgia, serif",
              }}
            >
              {selectedCategory}
            </h3>

            <div>
              {getFilteredCategories().map((category) => (
                <div key={category} style={{ marginBottom: "15px" }}>
                  {selectedCategory === "Todos" && (
                    <h4
                      style={{
                        textDecoration: "underline",
                        marginTop: "20px",
                        fontFamily: "Georgia, serif",
                        color: previewTextColor,
                      }}
                    >
                      {category}
                    </h4>
                  )}
                  {articles
                    .filter(
                      (article) =>
                        selectedCategory === "Todos" ||
                        article.category === selectedCategory
                    )
                    .filter((article) => article.category === category)
                    .map((filteredArticle, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "10px 0",
                          borderBottom: "1px solid #fff",
                          listStyle: "none",
                          fontFamily: "Arial, sans-serif",
                          color: previewTextColor,
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
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-4">
            {categories.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column", // Aseguramos que los botones estén en una columna
                  alignItems: "center", // Opcional: centrar horizontalmente
                  gap: "10px", // Espaciado entre los botones
                }}
              >
                {/* Botón para mostrar todos */}
                <Button
                  style={{
                    backgroundColor: previewButtonColor,
                    color: colorBtText,
                    border: "none",
                    width: "100%",
                  }}
                  className="preview-category-button hover-effect"
                  onClick={() => handleCategoryClick("Todos")}
                >
                  Todos
                </Button>

                {/* Botones de las categorías */}
                {getFilteredCategories().map((cat, index) => (
                  <Button
                    key={index}
                    style={{
                      backgroundColor: previewButtonColor,
                      color: colorBtText,
                      border: "none",
                      width: "100%",
                    }}
                    className="preview-category-button hover-effect"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            ) : (
              <p style={{ color: previewTextColor }}>No hay categorías disponibles.</p>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FullPreviewModal;