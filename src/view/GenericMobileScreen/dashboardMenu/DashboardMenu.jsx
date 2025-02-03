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
  const [logoUrl, setLogoUrl] = useState(null);
  console.log("logoUrl: ", logoUrl);
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
        console.log("📌 Archivo a subir:", logoFile);
  
        try {
          // ✅ Ruta Correcta en Firebase Storage
          const storageRef = ref(storage, `menu/${domain}/logo_${Date.now()}`);
  
          // ✅ Subir la imagen
          const snapshot = await uploadBytes(storageRef, logoFile);
  
          // ✅ Obtener la URL pública
          logoDownloadUrl = await getDownloadURL(snapshot.ref);
          console.log("✅ URL pública obtenida:", logoDownloadUrl);
  
        } catch (error) {
          console.error("❌ Error al subir el archivo a Firebase Storage:", error);
          alert("Error subiendo la imagen");
          return; // Detener la ejecución si hay un error
        }
      }
  
      // ✅ Guardar datos en Firestore
      const docRef = doc(db, `applicationsBase/menu/${domain}`, "defaultMenu");
      await setDoc(docRef, {
        menuTitle,
        logoUrl: logoDownloadUrl, // ✅ Guardamos la URL de Firebase
        previewButtonColor,
        previewBackgroundColor,
        previewTextColor,
        colorBtText,
        categories,
        articles,
      });
  
      alert("🎉 Carta guardada exitosamente.");
      setInitialData({
        menuTitle,
        logoUrl: logoDownloadUrl,
        previewButtonColor,
        previewBackgroundColor,
        previewTextColor,
        colorBtText,
        categories,
        articles,
      }); // ✅ Actualizar estado inicial después de guardar
      setHasChanges(false);
  
    } catch (error) {
      console.error("❌ Error guardando la carta en Firestore:", error);
      alert("Error guardando la carta");
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
      alert("Error cargando la carta");
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
      setLogoFile(file); // ✅ Guardamos el archivo para subirlo después
      setLogoUrl(URL.createObjectURL(file)); // ✅ Mostrar previsualización temporal
      setHasChanges(true);
    }
  };

  useEffect(() => {
    fetchFromFirestore();
  }, []);

  return (
    <Container className="mt-0">
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
          handleLogoChange={handleLogoChange}
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
