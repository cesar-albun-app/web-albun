import React, { useEffect, useState } from 'react';
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Albun-app"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (e) {
        console.error("Error fetching documents: ", e);
        setError("Error fetching data from the database.");
      } finally {
        // Aquí no cambiamos loading a false, dejamos que el contador lo maneje.
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount < 5) {
            return prevCount + 1;
          } else {
            clearInterval(interval);
            setLoading(false);
            return prevCount;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <Container>
    
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status" style={{ width: '5rem', height: '5rem' }}>
          </Spinner>
          <h2>{count}</h2>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
      
        <h1>Fotos</h1>
        <Row>
          {items.flatMap((item) => (
            item.images.map((image, index) => (
              <Col key={`${item.id}-${index}`} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={image} alt={`Image ${index}`} />
                  <Card.Body>
                    <Card.Title>{item.name} {item.surname}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ))}
        </Row>
        </>
      )}
    </Container>
  );
}
