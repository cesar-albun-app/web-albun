import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Form, Button, Alert, Container, Spinner } from "react-bootstrap";



  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
   
  };


const UpdateDb = ({ selectedImages, handleClearImages }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  const resizeImage = (imageSrc, width, height) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (name.trim() === "" || surname.trim() === "") {
      setError("Ingrese nombre y Déjame un mensaje ");
      return;
    }

    setIsLoading(true);
    setSuccess(false);
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          const response = await fetch(image);
          const blob = await response.blob();
          const resizedBlob = await resizeImage(URL.createObjectURL(blob), 1024, 1024);
          const storageRef = ref(
            storage,
            `images/${new Date().getTime()}-${blob.size}`
          );
          await uploadBytes(storageRef, resizedBlob);
          return getDownloadURL(storageRef);
        })
      );

      await addDoc(collection(db, "Albun-app"), {
        name: name,
        surname: surname,
        images: imageUrls, // Save the URLs of the images in Firestore
      });

      setName("");
      setSurname("");
      setError(null);
      setSuccess(true);
      handleClearImages();
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Error adding item to the database.");
      setSuccess(false);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">

        <div style={containerStyle}>

        Enviado con éxito. ¡Gracias por colaborar!  no hay plata para el fotógrafo.
          </div>
        
        </Alert>}

      {selectedImages.length > 0 && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form onSubmit={handleAddItem}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control-sm"
                style={{ maxWidth: "500px" }} // Set the maximum width of the input field
              />
            </Form.Group>
            <Form.Group className="mb-3">
      <Form.Label>Déjame un mensaje</Form.Label>
      <Form.Control
        as="textarea"
        placeholder="Mensaje"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        className="form-control-sm"
        style={{ maxWidth: '500px' }} // Set the maximum width of the input field
      />
    </Form.Group> 
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || selectedImages.length === 0}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Agregar"
              )}
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default UpdateDb;
