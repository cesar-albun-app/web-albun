import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";

function DynamicCards() {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const querySnapshot = await getDocs(collection(db, "route"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(data);
      } catch (e) {
        console.error("Error fetching documents: ", e);
        setError("Error fetching data from the database.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  const addCard = async () => {
    if (title.trim() && text.trim()) {
      const newCard = {
        id: cards.length + 1,
        title: title,
        text: text,
      };
      setCards([...cards, newCard]);
      setTitle("");
      setText("");
    }

    await addDoc(collection(db, "route"), {
      title: title,
      text: text,
    });
  };

  const handleDelete = async (id) => {
    try {
      setShow(true);
      setCardToDelete(id);
    } catch (error) {
      setError("Error fetching data from the database.");
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      // Eliminar el documento de Firestore
      await deleteDoc(doc(db, "route", cardToDelete));

      // Eliminar la tarjeta localmente
      setCards(cards.filter((card) => card.id !== cardToDelete));
      setShow(false);
      setCardToDelete(null);
    } catch (error) {
      setError("Error deleting the document.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setCardToDelete(null);
  };

  return (
    <Container className="p-4">
      <Row>
        <Col className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Agregar carpetas</Card.Title>
              <Card.Text>Puedes colocar una descripción.</Card.Text>
              <Form>
                <Form.Group controlId="formCardTitle" className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese Nombre de la carpeta"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCardText" className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese Descripción"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={addCard}
                  disabled={!title.trim() || !text.trim()}
                >
                  Agregar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {fetching ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {cards.length === 0 ? (
            <Col className="text-center">
              <Alert variant="warning">No tenemos datos que mostrar</Alert>
            </Col>
          ) : (
            cards.map((card) => (
              <Col key={card.id} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Card.Title>{card.title}</Card.Title>
                      <div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(card.id)}
                          style={{ marginRight: "8px" }}
                        >
                          X
                        </Button>
                      </div>
                    </div>
                    <Card.Text>{card.text}</Card.Text>
                  </Card.Body>
                  <Button
                    variant="secondary"
                    size="sm"
                    as={Link}
                    to={`/detail/${card.id}`}
                  >
                    Ver
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            "¿Estás seguro de que deseas eliminar esta tarjeta?"
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DynamicCards;
