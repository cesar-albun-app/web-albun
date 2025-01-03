import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Form, Button, Alert, Container, Spinner } from "react-bootstrap";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const UpdateDubiaDb = ({ selectedImages, handleClearImages }) => {
  const [productName, setProductName] = useState(""); // Product name
  const [subtitle, setSubtitle] = useState(""); // Subtitle
  const [details, setDetails] = useState(""); // Details
  const [amount, setAmount] = useState(""); // Amount
  const [category, setCategory] = useState(""); // Category
  const [errorMessage, setErrorMessage] = useState(null); // Error message
  const [loading, setLoading] = useState(false); // Loading state
  const [isSuccess, setIsSuccess] = useState(false); // Success state

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

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
    if (
      productName.trim() === "" ||
      subtitle.trim() === "" ||
      details.trim() === "" ||
      amount.trim() === "" ||
      category.trim() === ""
    ) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    setIsSuccess(false);
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          const response = await fetch(image);
          const blob = await response.blob();
          const resizedBlob = await resizeImage(
            URL.createObjectURL(blob),
            1024,
            1024
          );
          const storageRef = ref(
            storage,
            `images/${new Date().getTime()}-${blob.size}`
          );
          await uploadBytes(storageRef, resizedBlob);
          return getDownloadURL(storageRef);
        })
      );

      await addDoc(collection(db, "table-dubian"), {
        productName,
        subtitle,
        details,
        amount,
        category,
        images: imageUrls, // Save the URLs of the images in Firestore
      });

      setProductName("");
      setSubtitle("");
      setDetails("");
      setAmount("");
      setCategory("");
      setErrorMessage(null);
      setIsSuccess(true);
      handleClearImages();
    } catch (e) {
      console.error("Error adding document: ", e);
      setErrorMessage("Error adding the item to the database.");
      setIsSuccess(false);
    }
    setLoading(false);
  };

  return (
    <Container>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {isSuccess && (
        <Alert variant="success">
          <div style={containerStyle}>
          Enviado con éxito. ¡Gracias!
          </div>
        </Alert>
      )}

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
            <Form.Label>Nombre del producto</Form.Label>

              <Form.Control
                type="text"
                placeholder="Nombre"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="form-control-sm"
                style={{ maxWidth: "500px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Subtítulo</Form.Label>
            <Form.Control
                type="text"
                placeholder="Subtítulo"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="form-control-sm"
                style={{ maxWidth: "500px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Detalles</Form.Label>
            <Form.Control
                type="text"
                placeholder="Detalles"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="form-control-sm"
                style={{ maxWidth: "500px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
                type="number"
                placeholder="Monto"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control-sm"
                style={{ maxWidth: "500px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control-sm"
                style={{ maxWidth: "500px" }}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Beverages">Bebidas</option>
                <option value="Charcuterie">Charcutería</option>
                <option value="Promotions">Promociones</option>
              </Form.Select>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || selectedImages.length === 0}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "AGREGAR"
              )}
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default UpdateDubiaDb;