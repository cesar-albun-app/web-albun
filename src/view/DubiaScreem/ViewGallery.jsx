import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Table, Button, Form, Spinner, Dropdown } from "react-bootstrap";

import PhotoGalleryOpener from "../LoadingPage/PhotoGalleryOpener";

const ViewGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [savingProductId, setSavingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState("All");

  const categories = ["All", "Beverages", "Charcuterie", "Promotions"];
  const categoryTranslations = {
    All: "Todos",
    Beverages: "Bebidas",
    Charcuterie: "Charcutería",
    Promotions: "Promociones",
  }

  const tableActive="table-dubian"
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, tableActive));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    filteredCategory === "All"
      ? products
      : products.filter((product) => product.category === filteredCategory);

  const handleDelete = async (id) => {
    try {
      setDeletingProductId(id);
      await deleteDoc(doc(db, tableActive, id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleEditStart = (product) => {
    setEditingProductId(product.id);
    setEditableData(product);
    setSelectedImages(product.images || []);
  };

  const handleEditChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
    try {
      setSavingProductId(editingProductId);
      let updatedImages = selectedImages;

      if (selectedImages.length > 0 && selectedImages[0]?.startsWith("blob")) {
        updatedImages = await Promise.all(
          selectedImages.map(async (image, index) => {
            const blob = await fetch(image).then((res) => res.blob());
            const storageRef = ref(storage, `images/${Date.now()}-${index}`);
            await uploadBytes(storageRef, blob);
            return await getDownloadURL(storageRef);
          })
        );
      }

      const updatedProduct = { ...editableData, images: updatedImages };
      const productRef = doc(db, tableActive, editingProductId);
      await updateDoc(productRef, updatedProduct);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProductId ? updatedProduct : product
        )
      );

      setEditingProductId(null);
      setEditableData({});
      setSelectedImages([]);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSavingProductId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingProductId(null);
    setEditableData({});
    setSelectedImages([]);
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="pt-4">
      <h2 className="text-center mb-4">Productos</h2>

      {/* Filtro de Categoría */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Filtrar por Categoría
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {categories.map((category) => (
              <Dropdown.Item
                key={category}
                onClick={() => setFilteredCategory(category)}
              >
                {categoryTranslations[category] || category}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {categoryTranslations[filteredCategory] || filteredCategory}
        </span>
      </div>

      {/* Tabla de Productos */}
      <div
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",

        }}
      >
        <Table  bordered  responsive className="table-modern">
          <thead
            style={{
              backgroundColor: "red",
              borderBottom: "2px solid #dee2e6",
            }}
          >
            <tr>
              <th>#</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  {editingProductId === product.id ? (
                    <PhotoGalleryOpener
                      setSelectedImages={setSelectedImages}
                      selectedImages={selectedImages}
                      handleClearImages={() => setSelectedImages([])}
                    />
                  ) : (
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/50"}
                      alt={product.productName}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <Form.Control
                      type="text"
                      value={editableData.productName}
                      onChange={(e) =>
                        handleEditChange("productName", e.target.value)
                      }
                    />
                  ) : (
                    product.productName
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <Form.Control
                      type="text"
                      value={editableData.details}
                      onChange={(e) =>
                        handleEditChange("details", e.target.value)
                      }
                    />
                  ) : (
                    product.details
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <Form.Select
                      value={editableData.category}
                      onChange={(e) =>
                        handleEditChange("category", e.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {categoryTranslations[category] || category}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    categoryTranslations[product.category] || product.category
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <Form.Control
                      type="number"
                      value={editableData.amount}
                      onChange={(e) =>
                        handleEditChange("amount", e.target.value)
                      }
                    />
                  ) : (
                    `$${product.amount}`
                  )}
                </td>
                <td style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                  {editingProductId === product.id ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleEditSave}
                        style={{ minWidth: "80px" }}
                        disabled={savingProductId === editingProductId}
                      >
                        {savingProductId === editingProductId ? (
                          <Spinner as="span" size="sm" animation="border" />
                        ) : (
                          "Guardar"
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleEditCancel}
                        style={{ minWidth: "80px" }}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => handleEditStart(product)}
                        style={{ minWidth: "80px" }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        style={{ minWidth: "80px" }}
                        disabled={deletingProductId === product.id}
                      >
                        {deletingProductId === product.id ? (
                          <Spinner as="span" size="sm" animation="border" />
                        ) : (
                          "Eliminar"
                        )}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ViewGallery;