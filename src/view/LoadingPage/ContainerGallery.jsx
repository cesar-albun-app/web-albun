import React, { useState, useEffect } from "react";
import UpdateDb from "../../components/UpdateDb";
import PhotoUpload from "../../components/PhotoUpload";
import PhotoGalleryOpener from "../LoadingPage/PhotoGalleryOpener";
import ImagesApp from "../../assets/PHOTO-2024-07-27-17-05-07.jpg";

export default function ContainerGallery() {
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const cachedImages = JSON.parse(localStorage.getItem("selectedImages"));
    if (cachedImages) {
      setSelectedImages(cachedImages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [selectedImages]);

  const handleClearImages = () => {
    setSelectedImages([]);
    localStorage.removeItem("selectedImages");
  };

  return (
    <>
      <PhotoUpload>
        <img
          src={ImagesApp}
          alt="Descripción de la imagen"
          style={{
            width: "100%",
            height: "auto",
            margin: "0 auto",
            display: "block",
          }}
        />
 <h2 style={{
          textAlign: "center",
          fontSize: "2em",
          color: "#4A90E2",
          marginTop: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          Agrega tus fotos
        </h2>
        <PhotoGalleryOpener
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          handleClearImages={handleClearImages}
        />

        <UpdateDb
          handleClearImages={handleClearImages}
          selectedImages={selectedImages}
        />
      </PhotoUpload>
    </>
  );
}
