import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { Container, Table, Button, Spinner, Dropdown, ProgressBar } from "react-bootstrap";
import * as XLSX from "xlsx";

const ViewGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [uploadProgress, setUploadProgress] = useState(0); // Estado para el progreso

  const categories = ["All", "Beverages", "Charcuterie", "Promotions"];
  const categoryTranslations = {
    All: "Todos",
    Beverages: "Bebidas",
    Charcuterie: "Charcutería",
    Promotions: "Promociones",
  };

  const tableActive = "table-dubian";

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

      setUploadProgress(0); // Inicializa el progreso

      const newProducts = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setUploadProgress(Math.round(((i + 1) / rows.length) * 100)); // Actualiza el progreso

        const product = {
          productName: row.Nombre || "",
          details: row.Descripción || "",
          category: row.Categoría || "Uncategorized",
          amount: row.Precio || 0,
          images: [],
        };

        newProducts.push(product);
        await addDoc(collection(db, tableActive), product); // Guarda en Firestore registro por registro
      }

      // Actualizar la UI
      setProducts((prev) => [...prev, ...newProducts]);

      alert("Datos importados correctamente.");
    } catch (error) {
      console.error("Error importing Excel file:", error);
      alert("Hubo un error al procesar el archivo.");
    } finally {
      setTimeout(() => setUploadProgress(0), 1000); // Oculta la barra tras 1 segundo
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="pt-4">
      <h2 className="text-center mb-4">Productos</h2>

      {/* Botón para Importar Excel */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Filtrar por Categoría
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {categories.map((category) => (
              <Dropdown.Item key={category} onClick={() => setFilteredCategory(category)}>
                {categoryTranslations[category] || category}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <div>
          <label htmlFor="upload-excel" className="btn btn-success">
            Importar Excel
          </label>
          <input
            type="file"
            id="upload-excel"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
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
          />
        </div>
      )}

      {/* Tabla de Productos */}
      <div style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px", overflow: "hidden" }}>
        <Table bordered responsive className="table-modern">
          <thead style={{ backgroundColor: "red", borderBottom: "2px solid #dee2e6" }}>
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
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.details}</td>
                <td>{categoryTranslations[product.category] || product.category}</td>
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