import React, { useState, useEffect } from "react";
import UpdateKarlaDb from "../../components/UpdateKarlaDb";
import PhotoUpload from "../../components/PhotoUpload";
import PhotoGalleryOpener from "../LoadingPage/PhotoGalleryOpener";
import ViewGallery from "./ViewGallery";

export default function UpdateImagesKarla() {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("addImage"); // 'addImage' o 'viewProducts'

  // Estado para la carga de imágenes en la primera sección
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
    <div>
      {/* Barra de Pestañas */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          borderBottom: "2px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveTab("addImage")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderBottom: activeTab === "addImage" ? "2px solid #4A90E2" : "none",
            backgroundColor: "transparent",
            fontWeight: "bold",
            color: activeTab === "addImage" ? "#4A90E2" : "#555",
            cursor: "pointer",
          }}
        >
          Agrega
        </button>
        <button
          onClick={() => setActiveTab("viewProducts")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderBottom:
              activeTab === "viewProducts" ? "2px solid #4A90E2" : "none",
            backgroundColor: "transparent",
            fontWeight: "bold",
            color: activeTab === "viewProducts" ? "#4A90E2" : "#555",
            cursor: "pointer",
          }}
        >
          Ver
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === "addImage" && (
        <PhotoUpload>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2em",
              color: "#4A90E2",
              marginTop: "20px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Agrega Imagen
          </h2>

          <PhotoGalleryOpener
            selectedImages={uploadImages}
            setSelectedImages={setUploadImages}
            handleClearImages={handleClearUploadImages}
          />

          <UpdateKarlaDb
            handleClearImages={handleClearUploadImages}
            selectedImages={uploadImages}
          />
        </PhotoUpload>
      )}

      {activeTab === "viewProducts" && (
        <PhotoUpload>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2em",
              color: "#4A90E2",
              marginTop: "20px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Ver Productos
          </h2>
          <ViewGallery />
        </PhotoUpload>
      )}
    </div>
  );
}