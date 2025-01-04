import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  ProgressBar,
  CloseButton,
} from "react-bootstrap";

const PhotoGalleryOpener = ({
  setSelectedImages,
  selectedImages = [], // Asegura que siempre sea un array por defecto
  handleClearImages,
}) => {
  const [progress, setProgress] = useState(0);

  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).slice(0, 10);
      setSelectedImages([]);
      setProgress(0);

      filesArray.forEach((file, index) => {
        setTimeout(() => {
          setSelectedImages((prevImages) => [
            ...prevImages,
            URL.createObjectURL(file),
          ]);
          setProgress(((index + 1) / filesArray.length) * 100);
        }, index * 1000); // Simula un retardo de carga
      });

      // Oculta la barra de progreso después de que todas las imágenes se hayan cargado
      setTimeout(() => {
        setProgress(0);
      }, filesArray.length * 1000 + 500);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = Array.isArray(selectedImages)
      ? selectedImages.filter((_, i) => i !== index)
      : [];
    setSelectedImages(updatedImages);
  };

  return (
    <div className="text-center">
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        multiple
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <div className="d-flex justify-content-center mb-3">
        <Button
          onClick={() => document.getElementById("fileInput").click()}
          variant="success"
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            backgroundColor: Array.isArray(selectedImages) && selectedImages.length > 0 ? "gray" : "green",
            borderColor: Array.isArray(selectedImages) && selectedImages.length > 0 ? "gray" : "green",
          }}
          disabled={Array.isArray(selectedImages) && selectedImages.length > 0}
        >
          Agregar
        </Button>
        <Button
          onClick={handleClearImages}
          variant="danger"
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            marginLeft: "10px",
            backgroundColor: !Array.isArray(selectedImages) || selectedImages.length === 0 ? "gray" : "red",
            borderColor: !Array.isArray(selectedImages) || selectedImages.length === 0 ? "gray" : "red",
          }}
          disabled={!Array.isArray(selectedImages) || selectedImages.length === 0}
        >
          Borrar
        </Button>
      </div>

      {progress > 0 && (
        <ProgressBar
          now={progress}
          label={`${Math.round(progress)}%`}
          className="mb-3"
        />
      )}

      {Array.isArray(selectedImages) && selectedImages.length > 0 && (
        <div className="mt-4">
          <h3
            style={{ color: "black", fontSize: "20px", marginBottom: "10px" }}
          >
            Imágenes seleccionadas:
          </h3>
          <Row className="justify-content-center">
            {selectedImages.map((image, index) => (
              <Col md={6} lg={4} className="mb-3" key={index}>
                <Card style={{ position: "relative" }}>
                  <CloseButton
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 1,
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveImage(index)}
                  />
                  <Card.Img src={image} alt={`Seleccionada ${index + 1}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryOpener;