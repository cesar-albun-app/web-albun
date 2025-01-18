import React, { useState, useEffect } from "react";
import UpdateGenericDb from "../../components/UpdateGenericDb";
import PhotoUpload from "../../components/PhotoUpload";
import PhotoGalleryOpener from "../LoadingPage/PhotoGalleryOpener";
import ViewGalleryGeneric from "./ViewGalleryGeneric";
import ImportMasivo from "./ImportMasivo";
import styles from "./styles/UpdateImagesGeneric.module.css"; // CSS Module

export default function UpdateImagesGeneric(userData) {
  const { domain } = userData.userData;

  const [activeTab, setActiveTab] = useState("addImage"); // Estado de la pestaña activa
  const [uploadImages, setUploadImages] = useState([]);

  useEffect(() => {
    const cachedImages = JSON.parse(localStorage.getItem("uploadImages"));
    if (cachedImages) {
      setUploadImages(cachedImages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("uploadImages", JSON.stringify(uploadImages));
  }, [uploadImages]);

  const handleClearUploadImages = () => {
    setUploadImages([]);
    localStorage.removeItem("uploadImages");
  };

  return (
    <div className={styles.container}>
      {/* Barra de Pestañas */}
      <div className={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab("addImage")}
          className={`${styles.tabButton} ${
            activeTab === "addImage" ? styles.activeTab : ""
          }`}
        >
          Agrega
        </button>
        <button
          onClick={() => setActiveTab("viewProducts")}
          className={`${styles.tabButton} ${
            activeTab === "viewProducts" ? styles.activeTab : ""
          }`}
        >
          Ver
        </button>
        <button
          onClick={() => setActiveTab("viewMaxi")}
          className={`${styles.tabButton} ${
            activeTab === "viewMaxi" ? styles.activeTab : ""
          }`}
        >
          Importar Excel
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === "addImage" && (
        <PhotoUpload>
          <h2 className={styles.sectionTitle}>Agrega Imagen</h2>
          <PhotoGalleryOpener
            selectedImages={uploadImages}
            setSelectedImages={setUploadImages}
            handleClearImages={handleClearUploadImages}
          />
          <UpdateGenericDb
            handleClearImages={handleClearUploadImages}
            selectedImages={uploadImages}
            domain={domain}
          />
        </PhotoUpload>
      )}

      {activeTab === "viewProducts" && (
        <PhotoUpload>
          <h2 className={styles.sectionTitle}>Ver Productos</h2>
          <ViewGalleryGeneric domain={domain} />
        </PhotoUpload>
      )}

      {activeTab === "viewMaxi" && (
        <PhotoUpload>
          <h2 className={styles.sectionTitle}>Importar Masivo</h2>
          <ImportMasivo domain={domain} />
        </PhotoUpload>
      )}
    </div>
  );
}