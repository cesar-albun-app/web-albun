import React, { useState, useEffect } from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export default function MenuOnlinePage(userData) {
  const domain = userData?.userData?.domain || ""; // Valor predeterminado vacío

  const [categories, setCategories] = useState([]);
  const [menuTitle, setMenuTitle] = useState(
    "Ingresa el título principal del menú aquí"
  );
  const [logoUrl, setLogoUrl] = useState("https://via.placeholder.com/100");
  const [previewButtonColor, setPreviewButtonColor] = useState("#007bff");
  const [previewBackgroundColor, setPreviewBackgroundColor] = useState("#000");
  const [previewTextColor, setPreviewTextColor] = useState("#fff");
  const [colorBtText, setColorBtText] = useState("#fff");
  const [articles, setArticles] = useState([]);
  const [logoFile, setLogoFile] = useState(null); // Almacena el archivo del logo
  const [isSaving, setIsSaving] = useState(false); // Estado del spinner
  const [hasChanges, setHasChanges] = useState(false); // Detecta si hay cambios en los datos
  const [initialData, setInitialData] = useState({}); // Para comparar cambios

  // Cargar datos desde Firestore
  const fetchFromFirestore = async () => {
    try {
      const patientsCollection = collection(
        db,
        `applicationsBase/menu/${domain}`
      );
      const docRef = doc(patientsCollection, "defaultMenu");
      const menuDoc = await getDoc(docRef);

      if (menuDoc.exists()) {
        const menuData = menuDoc.data();
        setMenuTitle(menuData.menuTitle || "Título no disponible");
        setLogoUrl(menuData.logoUrl || "https://via.placeholder.com/100");
        setPreviewButtonColor(menuData.previewButtonColor || "#007bff");
        setPreviewBackgroundColor(menuData.previewBackgroundColor || "#000");
        setPreviewTextColor(menuData.previewTextColor || "#fff");
        setColorBtText(menuData.colorBtText || "#fff");
        setCategories(menuData.categories || []);
        setArticles(menuData.articles || []);
        setInitialData(menuData); // Guardar datos iniciales para comparación
      } else {
        alert("No hay datos guardados.");
      }
    } catch (error) {
      console.error("Error recuperando la carta: ", error);
      alert("Error cargando la carta. Revisa la consola para más detalles.");
    }
  };

  // Detectar cambios en los datos
  useEffect(() => {
    const currentData = {
      menuTitle,
      logoUrl,
      previewButtonColor,
      previewBackgroundColor,
      previewTextColor,
      colorBtText,
      categories,
      articles,
    };
    setHasChanges(JSON.stringify(currentData) !== JSON.stringify(initialData));
  }, [
    menuTitle,
    logoUrl,
    previewButtonColor,
    previewBackgroundColor,
    previewTextColor,
    colorBtText,
    categories,
    articles,
  ]);

  useEffect(() => {
    fetchFromFirestore();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const getGroupedArticles = () => {
    return articles.reduce((acc, article) => {
      const { category } = article;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(article);
      return acc;
    }, {});
  };

  const groupedArticles = getGroupedArticles();

  const getFilteredArticles = () => {
    if (selectedCategory === "Todos" || !selectedCategory) {
      return groupedArticles;
    }
    return { [selectedCategory]: groupedArticles[selectedCategory] || [] };
  };

  return (
    <div
      style={{
        backgroundColor: previewBackgroundColor,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container>
        {/* Logo y Título */}
        <Row>
          <Col className="text-center">
            <img
              src={logoUrl}
              alt="Logo"
              style={{ maxWidth: "150px", marginBottom: "20px" }}
            />
            <h1
              style={{
                color: previewTextColor,
                fontFamily: "Georgia, serif",
                marginBottom: "20px",
              }}
            >
              {menuTitle}
            </h1>
          </Col>
        </Row>

        {/* Contenido Principal */}
        <Row>
          <Col>
            {selectedCategory ? (
              <div>
                {/* Botón para regresar a categorías */}
                <Button
                  variant="secondary"
                  onClick={handleBackToCategories}
                  style={{ marginBottom: "20px" }}
                >
                  Volver a Categorías
                </Button>

                {/* Título de la categoría seleccionada */}
                <h2
                  style={{
                    color: previewTextColor,
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  {selectedCategory}
                </h2>

                {/* Lista de artículos filtrados */}
                {Object.entries(getFilteredArticles()).map(
                  ([category, articles]) => (
                    <div key={category}>
                      <h3
                        style={{
                          color: previewTextColor,
                          textDecoration: "underline",
                          marginBottom: "10px",
                        }}
                      >
                        {category}
                      </h3>
                      {articles.map((article, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "10px 0",
                            borderBottom: "1px solid #fff",
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
                            <span style={{ fontWeight: "bold" }}>
                              {article.name}
                            </span>
                            <span>
                              $
                              {new Intl.NumberFormat("es-ES", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(article.price))}
                            </span>{" "}
                          </div>
                          {article.description && (
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "#ccc",
                                marginTop: "5px",
                              }}
                            >
                              {article.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center mt-4">
                {/* Lista de categorías */}
                {categories.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Botón "Todos" */}
                    <Button
                      style={{
                        backgroundColor: previewButtonColor,
                        color: colorBtText,
                        border: "none",
                        width: "100%",
                      }}
                      onClick={() => handleCategoryClick("Todos")}
                    >
                      Todos
                    </Button>

                    {/* Botones de categorías */}
                    {categories.map((cat, index) => (
                      <Button
                        key={index}
                        style={{
                          backgroundColor: previewButtonColor,
                          color: colorBtText,
                          border: "none",
                          width: "100%",
                        }}
                        onClick={() => handleCategoryClick(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: previewTextColor }}>
                    No hay categorías disponibles.
                  </p>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
