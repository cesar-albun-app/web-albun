import React, { useState } from "react";
import { Button, Card, Row, Col, ProgressBar, CloseButton } from "react-bootstrap";
import styles from "../GenericMobileScreen/styles/PhotoGalleryOpener.module.css"

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

      setTimeout(() => {
        setProgress(0);
      }, filesArray.length * 1000 + 500);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        multiple
        className={styles.fileInput}
        onChange={handleImageChange}
      />

      <div className={styles.buttonContainer}>
        <Button
          onClick={() => document.getElementById("fileInput").click()}
          variant="success"
          className={`${styles.button} ${selectedImages.length > 0 && styles.disabledButton}`}
          disabled={selectedImages.length > 0}
        >
          Agregar
        </Button>
        <Button
          onClick={handleClearImages}
          variant="danger"
          className={`${styles.button} ${
            selectedImages.length === 0 && styles.disabledButton
          }`}
          disabled={selectedImages.length === 0}
        >
          Borrar
        </Button>
      </div>

      {progress > 0 && (
        <ProgressBar
          now={progress}
          label={`${Math.round(progress)}%`}
          className={styles.progressBar}
        />
      )}

      {selectedImages.length > 0 && (
        <div className={styles.gallery}>
          <h3 className={styles.title}>Imágenes seleccionadas:</h3>
          <Row className="justify-content-center">
            {selectedImages.map((image, index) => (
              <Col md={6} lg={4} className={`${styles.imageCol}`} key={index}>
                <Card className={`${styles.card} ${styles.imageCard}`}>
                  <CloseButton
                    className={styles.closeButton}
                    onClick={() => handleRemoveImage(index)}
                  />
                  <Card.Img
                    src={image}
                    alt={`Seleccionada ${index + 1}`}
                    className={styles.image}
                  />
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