import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Container, Table, Button, Spinner, Dropdown, ProgressBar } from "react-bootstrap";
import * as XLSX from "xlsx";
import styles from "./styles/ViewGallery.module.css";

const ViewGallery = ({ domain }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (rows.length > 100) {
        alert("Máximo permitido: 100 registros.");
        return;
      }

      setUploadProgress(0);

      const newProducts = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setUploadProgress(Math.round(((i + 1) / rows.length) * 100));

        const product = {
          productName: row.Nombre || "",
          details: row.Descripción || "",
          category: row.Categoría || "Uncategorized",
          amount: row.Precio || 0,
          images: [],
        };

        newProducts.push(product);
        await addDoc(
          collection(db, `applicationsBase/StoreInventory/${tableActive}`),
          product
        );
      }

      setProducts((prev) => [...prev, ...newProducts]);
      alert("Datos importados correctamente.");
    } catch (error) {
      console.error("Error importing Excel file:", error);
      alert("Hubo un error al procesar el archivo.");
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
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

      {/* Botón para Importar Excel */}
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

        <div>
          <label htmlFor="upload-excel" className={styles.uploadLabel}>
            Importar Excel
          </label>
          <input
            type="file"
            id="upload-excel"
            accept=".xlsx, .xls"
            className={styles.hiddenInput}
            onChange={handleExcelImport}
          />
        </div>
      </div>

      {/* Barra de Progreso */}
      {uploadProgress > 0 && (
        <div className="mb-4">
          <ProgressBar
            animated
            now={uploadProgress}
            label={`${uploadProgress}%`}
            className={styles.progressBar}
          />
        </div>
      )}

      {/* Tabla de Productos */}
      <div className={styles.tableContainer}>
        <Table bordered responsive className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} className={styles.tableRow}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.details}</td>
                <td>
                  {categoryTranslations[product.category] || product.category}
                </td>
                <td>{`$${product.amount}`}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ViewGallery;