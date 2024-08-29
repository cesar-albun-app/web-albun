import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, ListGroup, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TripsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [mapLink, setMapLink] = useState(''); // Estado para almacenar el enlace de Google Maps
  const [image, setImage] = useState(''); // Estado para almacenar la URL base64 de la imagen
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const loadItems = () => {
      const storedItems = localStorage.getItem('items');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    };
    loadItems();
  }, []);

  const openModal = () => setModalVisible(true);

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setDescription('');
    setLink('');
    setMapLink(''); // Resetea el enlace de Google Maps
    setImage(''); // Resetea la imagen
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Guarda la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const saveItem = () => {
    if (description) {  // Solo se requiere que la descripción esté presente
      const newItem = {
        id: editingItem ? editingItem.id : Date.now().toString(),
        description,
        link, // Opcional
        mapLink, // Opcional
        image, // Opcional
      };

      const updatedItems = editingItem
        ? items.map(item => (item.id === editingItem.id ? newItem : item))
        : [...items, newItem];

      setItems(updatedItems);
      localStorage.setItem('items', JSON.stringify(updatedItems));

      closeModal();
    }
  };

  const openDeleteModal = item => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDeleteItem = () => {
    const updatedItems = items.filter(item => item.id !== itemToDelete.id);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setDeleteModalVisible(false);
  };

  const editItem = item => {
    setDescription(item.description);
    setLink(item.link);
    setMapLink(item.mapLink); // Carga el enlace de Google Maps al estado
    setImage(item.image);
    setEditingItem(item);
    openModal();
  };

  return (
    <Container className="pt-4 text-center">
      <Card
        className="mb-4 text-center"
        style={{
          backgroundColor: '#ff6f61', 
          border: '5px solid #f7e7ce', 
          color: '#fff', 
          borderRadius: '15px', 
          textAlign: 'center', 
        }}
      >
        <Card.Body>
          <Button
            variant="light"
            onClick={openModal}
            style={{
              backgroundColor: '#ffcc00',
              color: '#000',
              border: '2px solid #fff',
              fontFamily: 'Comic Sans MS',
              fontSize: '1.5rem',
              padding: '10px 20px',
            }}
          >
            Agregar items
          </Button>
        </Card.Body>
      </Card>

      <ListGroup>
        {items.map(item => (
          <ListGroup.Item
            key={item.id}
            style={{
              backgroundColor: '#9188c2',
              color: '#000', 
              fontFamily: 'Comic Sans MS', 
              fontSize: '1.2rem',
              border: '2px solid #fff',
              marginBottom: '10px',
              borderRadius: '10px',
            }}
          >
            <Row>
              <strong  style={{
                fontFamily: 'Comic Sans MS', 
                fontSize: '1rem',
              }}>{item.description}</strong>
              <Col md={4}>
                <img src={item.image} alt={item.description} style={{ width: '30%', borderRadius: '10px', height: '100%' }} />
              </Col>
              <Col md={8}>
                <div className="mt-2">
                  {item.link && (
                    <Button
                      variant="primary"
                      style={{
                        fontFamily: 'Comic Sans MS',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        marginRight: '10px',
                      }}
                      href={item.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ir al enlace
                    </Button>
                  )}
                  {item.mapLink && (
                    <Button
                      variant="success"
                      style={{
                        fontFamily: 'Comic Sans MS',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        marginRight: '10px',
                      }}
                      href={item.mapLink} // Botón para abrir el enlace de Google Maps
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en el mapa
                    </Button>
                  )}
                  <Button
                    variant="info"
                    style={{
                      fontFamily: 'Comic Sans MS',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      marginRight: '10px',
                    }}
                    onClick={() => editItem(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    style={{
                      fontFamily: 'Comic Sans MS',
                      fontSize: '1rem',
                      borderRadius: '8px',
                    }}
                    onClick={() => openDeleteModal(item)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal para agregar/editar items */}
      <Modal show={modalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Comic Sans MS', fontSize: '1.5rem' }}>
            {editingItem ? 'Editar Item' : 'Agregar Item'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Comic Sans MS' }}>
          <Form>
            <Form.Group controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripción"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLink">
              <Form.Label>Enlace</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com"
                value={link}
                onChange={e => setLink(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMapLink">
              <Form.Label>Enlace del Mapa de Google</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://maps.google.com"
                value={mapLink}
                onChange={e => setMapLink(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Cargar Imagen</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange} // Maneja la carga de la imagen
              />
              {image && <img src={image} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={saveItem}
            style={{
              fontFamily: 'Comic Sans MS',
              fontSize: '1rem',
            }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={deleteModalVisible} onHide={() => setDeleteModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'Comic Sans MS', fontSize: '1.5rem' }}>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Comic Sans MS', fontSize: '1rem' }}>
          <p>¿Estás seguro de que deseas eliminar este ítem?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteModalVisible(false)}
            style={{
              fontFamily: 'Comic Sans MS',
              fontSize: '1rem',
              marginRight: '40px',
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeleteItem}
            style={{
              fontFamily: 'Comic Sans MS',
              fontSize: '1rem',
              marginLeft: '10px',
            }}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}