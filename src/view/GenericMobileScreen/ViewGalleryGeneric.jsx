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
import {
  Container,
  Table,
  Button,
  Form,
  Spinner,
  Dropdown,
} from "react-bootstrap";

import PhotoGalleryOpener from "../LoadingPage/PhotoGalleryOpener";
import styles from "./styles/ViewGalleryGeneric.module.css";

const ViewGalleryGeneric = ({ domain }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [savingProductId, setSavingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState("All");

  const categories = ["All", "Poduct", "Promotions"];
  const categoryTranslations = {
    All: "Todos",
    Poduct: "Productos",
    Promotions: "Promociones",
  };

  const tableActive = domain;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, `applicationsBase/StoreInventory/${tableActive}`)
        );
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
      await deleteDoc(doc(db, `applicationsBase/StoreInventory/${tableActive}`, id));
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
      const productRef = doc(
        db,
        `applicationsBase/StoreInventory/${tableActive}`,
        editingProductId
      );
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
        className={`${styles.loadingContainer} d-flex justify-content-center align-items-center`}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className={`${styles.container} pt-4`}>
      <h2 className={`${styles.title} text-center mb-4`}>Productos</h2>

      <div className={`${styles.filterContainer} mb-4`}>
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
        <span className={styles.filterLabel}>
          {categoryTranslations[filteredCategory] || filteredCategory}
        </span>
      </div>

      <div className={styles.tableContainer}>
        <Table bordered responsive className={styles.table}>
          <thead>
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
                      className={styles.productImage}
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
                <td className={styles.actionButtons}>
                  {editingProductId === product.id ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleEditSave}
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
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
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

export default ViewGalleryGeneric;