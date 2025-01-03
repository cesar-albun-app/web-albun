import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Asegúrate de que el archivo firebase.js esté configurado
import { collection, getDocs } from "firebase/firestore";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import OrderSummary from "./OrderSummary";

const MobileProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [activePed, setActivePed] = useState(false);

  const categories = ["All", "Poduct", "Trata", "Promotions"];
  const categoryTranslations = {
    All: "Todos",
    Poduct: "Productos",
    Trata: "Tratamientos",
    Promotions: "Promociones",
  };



  const [filteredCategory, setFilteredCategory] = useState("All");

  const filteredProducts =
    filteredCategory === "All"
      ? products
      : products.filter((product) => product.category === filteredCategory);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "table-karla"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);

        // Inicializar cantidades para cada producto
        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleIncrement = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Actualizar cantidades
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));

    // Agregar al carrito o actualizar cantidad
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);
      if (existingProduct) {
        // Actualizar cantidad si ya existe en el carrito
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Agregar nuevo producto al carrito
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleDecrement = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Actualizar cantidades
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(prevQuantities[productId] - 1, 0),
    }));

    // Actualizar el carrito
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);
      if (existingProduct) {
        if (existingProduct.quantity === 1) {
          // Eliminar del carrito si la cantidad llega a 0
          return prevCart.filter((item) => item.id !== productId);
        } else {
          // Reducir la cantidad en el carrito
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
      }
      return prevCart;
    });
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
    <>
      {activePed ? (
        <OrderSummary
          goBack={setActivePed}
          cart={cart}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          setCart={setCart}
          setQuantities={setQuantities}
        />
      ) : (
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Barra de Categorías */}
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              backgroundColor: "#fff",
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilteredCategory(category)}
                style={{
                  padding: "10px 20px",
                  margin: "0 5px",
                  backgroundColor:
                    filteredCategory === category ? "#FFA500" : "#f0f0f0",
                  color: filteredCategory === category ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {categoryTranslations[category] || category}
              </button>
            ))}
          </div>

          {/* Contenedor con Scroll */}
          <div
            style={{
              overflowY: "auto",
              height: "calc(100vh - 120px)",
              paddingBottom: "20px",
            }}
          >
            <Container className="pt-4">
              <h2 className="text-center mb-4">Productos</h2>
              <Row>
                {filteredProducts.map((product) => (
                  <Col xs={12} key={product.id} className="mb-3">
                    <Card
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "none",
                        boxShadow:
                          "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Row className="no-gutters">
                        <Col xs={4} style={{ position: "relative" }}>
                          {quantities[product.id] > 0 && (
                            <span
                              style={{
                                position: "absolute",
                                right: "-1px",
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                zIndex: 10,
                              }}
                            >
                              {quantities[product.id]}
                            </span>
                          )}
                          <Card.Img
                            src={
                              product.images?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={product.productName}
                            style={{
                              width: "100%",
                              height: "90px",
                              objectFit: "cover",
                            }}
                          />
                        </Col>
                        <Col xs={8}>
                          <Card.Body style={{ padding: "10px" }}>
                            <Card.Title
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                marginBottom: "5px",
                              }}
                            >
                              {product.productName}
                            </Card.Title>
                            <Card.Text
                              style={{
                                fontSize: "0.8rem",
                                color: "#666",
                                marginBottom: "10px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {product.details || "No details available."}
                            </Card.Text>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.9rem",
                                  fontWeight: "bold",
                                  color: "#333",
                                }}
                              >
                                ${product.amount}
                              </span>
                              {quantities[product.id] === 0 ? (
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleIncrement(product.id)}
                                  style={{
                                    borderRadius: "50%",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0",
                                  }}
                                >
                                  +
                                </Button>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "5px",
                                  }}
                                >
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleDecrement(product.id)}
                                    style={{
                                      borderRadius: "50%",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: "0",
                                    }}
                                  >
                                    -
                                  </Button>
                                  <span
                                    style={{
                                      fontSize: "0.9rem",
                                      fontWeight: "bold",
                                      color: "#333",
                                    }}
                                  >
                                    {quantities[product.id]}
                                  </span>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleIncrement(product.id)}
                                    style={{
                                      borderRadius: "50%",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: "0",
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>

          {/* Solapa inferior */}
          <div
            style={{
              position: "fixed",
              bottom: "0",
              left: "0",
              right: "0",
              backgroundColor: "#fff",
              borderTop: "1px solid #ddd",
              boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
              zIndex: 1000,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {cart.length} producto(s)
              </span>
              <br />
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                $
                {cart.reduce(
                  (acc, item) => acc + item.amount * item.quantity,
                  0
                )}
              </span>
            </div>
            <Button
            disabled={cart.length === 0  }
              variant="warning"
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                borderRadius: "20px",
                padding: "10px 20px",
              }}
              onClick={() => setActivePed(true)}
            >
              Ver mi pedido
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileProductScreen;
