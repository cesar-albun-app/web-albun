import React, { useState, useEffect } from "react";
import UpdateDubiaDb from "../../components/UpdateDubiaDb";
import PhotoUpload from "../../components/PhotoUpload";
import PhotoGalleryOpener from "../LoadingPage/PhotoGalleryOpener";

export default function UpdateImagesDubia() {
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
       
 <h2 style={{
          textAlign: "center",
          fontSize: "2em",
          color: "#4A90E2",
          marginTop: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          Agrega Imagen
        </h2>
        <PhotoGalleryOpener
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          handleClearImages={handleClearImages}
        />

        <UpdateDubiaDb
          handleClearImages={handleClearImages}
          selectedImages={selectedImages}
        />
      </PhotoUpload>
    </>
  );
 



  
}