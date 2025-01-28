import React, { useState, useEffect } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase"; // Ajusta la importación según tu configuración
import { Link } from "react-router-dom";

import Category from "./Components/Category";
import ArticleManager from "./Components/ArticleManager";
import FullPreviewModal from "./Components/FullPreviewModal";

export default function DashboardMenu(userData) {
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
  const [showPreview, setShowPreview] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // Almacena el archivo del logo
  const [isSaving, setIsSaving] = useState(false); // Estado del spinner
  const [hasChanges, setHasChanges] = useState(false); // Detecta si hay cambios en los datos
  const [initialData, setInitialData] = useState({}); // Para comparar cambios

  const togglePreview = () => setShowPreview(!showPreview);

  // Guardar datos en Firestore y Storage
  const saveToFirestore = async () => {
    try {
      setIsSaving(true);
      let logoDownloadUrl = logoUrl;

      // Subir logo al almacenamiento si se seleccionó un archivo
      if (logoFile) {
        const storageRef = ref(storage, `menus/logo`);
        await uploadBytes(storageRef, logoFile);
        logoDownloadUrl = await getDownloadURL(storageRef);
      }

      const patientsCollection = collection(
        db,
        `applicationsBase/menu/${domain}`
      );
      const docRef = doc(patientsCollection, "defaultMenu");

      await setDoc(docRef, {
        menuTitle,
        logoUrl: logoDownloadUrl,
        previewButtonColor,
        previewBackgroundColor,
        previewTextColor,
        colorBtText,
        categories,
        articles,
      });

      alert("Carta guardada exitosamente en Firebase.");
      setInitialData({
        menuTitle,
        logoUrl: logoDownloadUrl,
        previewButtonColor,
        previewBackgroundColor,
        previewTextColor,
        colorBtText,
        categories,
        articles,
      }); // Actualizar datos iniciales después de guardar
      setHasChanges(false);
    } catch (error) {
      console.error("Error guardando la carta: ", error);
      alert("Error guardando la carta. Revisa la consola para más detalles.");
    } finally {
      setIsSaving(false);
    }
  };

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

  // Manejo de cambio de imagen
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file)); // Mostrar vista previa
      setHasChanges(true);
    }
  };

  useEffect(() => {
    fetchFromFirestore();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Dashboard</h1>
      <Row>
        <Category
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          previewButtonColor={previewButtonColor}
          setPreviewButtonColor={setPreviewButtonColor}
          previewBackgroundColor={previewBackgroundColor}
          setPreviewBackgroundColor={setPreviewBackgroundColor}
          previewTextColor={previewTextColor}
          setPreviewTextColor={setPreviewTextColor}
          colorBtText={colorBtText}
          setColorBtText={setColorBtText}
          menuTitle={menuTitle}
          setMenuTitle={setMenuTitle}
          categories={categories}
          setCategories={setCategories}
          onLogoChange={handleLogoChange}
        />
        <ArticleManager
          articles={articles}
          setArticles={setArticles}
          Categories={categories}
        />
      </Row>
      <div className="text-center mt-4">
        <Button variant="success" onClick={togglePreview} size="lg">
          Vista Previa de la Carta
        </Button>
        <Button
          variant="primary"
          onClick={saveToFirestore}
          size="lg"
          className="ms-3"
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Guardar tu Carta"
          )}
        </Button>
        <Button
          as={Link}
          to={`/menu/${domain}`}
          size="lg"
          className="ms-3"
          variant="secondary"
        >
          ver mi carta online
        </Button>
      </div>
      <FullPreviewModal
        showPreview={showPreview}
        togglePreview={togglePreview}
        menuTitle={menuTitle}
        logoUrl={logoUrl}
        previewButtonColor={previewButtonColor}
        previewBackgroundColor={previewBackgroundColor}
        previewTextColor={previewTextColor}
        colorBtText={colorBtText}
        categories={categories}
        articles={articles}
      />
    </Container>
  );
}
