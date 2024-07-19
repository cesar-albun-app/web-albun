import React, { useState, useEffect } from "react";
import UpdateDb from "../components/UpdateDb";
import PhotoUpload from "../components/PhotoUpload";
import PhotoGalleryOpener from "../view/PhotoGalleryOpener";

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
