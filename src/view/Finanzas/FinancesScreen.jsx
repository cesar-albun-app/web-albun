import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, ListGroup, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FinancesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
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
    setAmount('');
  };

  const saveItem = () => {
    if (description && amount && !isNaN(Number(amount))) {
      const newItem = {
        id: editingItem ? editingItem.id : Date.now().toString(),
        description,
        amount: parseFloat(amount).toFixed(2),
        paid: editingItem ? editingItem.paid : false,
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
    setAmount(item.amount);
    setEditingItem(item);
    openModal();
  };

  const markAsPaid = id => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, paid: !item.paid } : item
    );
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
  };

  const calculatePaidDiscount = () => {
    return items
      .reduce((sum, item) => (item.paid ? sum + parseFloat(item.amount) : sum), 0)
      .toFixed(2);
  };

  return (
    <Container className="pt-4 text-center">
    <Card
      className="mb-4 text-center"
      style={{
        backgroundColor: '#ff6f61', // Color vibrante retro
        border: '5px solid #f7e7ce', // Bordes estilo retro
        color: '#fff', // Texto blanco
        borderRadius: '15px', // Bordes redondeados
        textAlign: 'center', // Texto centrado
      }}
    >
      <Card.Body>
        <Card.Title style={{ fontSize: '3rem', fontFamily: 'Comic Sans MS' }}>
          Total: ${calculateTotal()}
        </Card.Title>
        <Card.Text style={{ fontSize: '2rem', fontFamily: 'Comic Sans MS' }}>
          Pagado: ${calculatePaidDiscount()}
        </Card.Text>
        <Card.Text style={{ fontSize: '2rem', fontFamily: 'Comic Sans MS' }}>
          Restante: ${(calculateTotal() - calculatePaidDiscount()).toFixed(2)}
        </Card.Text>
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
          Agregar Gastos
        </Button>
      </Card.Body>
    </Card>

    <ListGroup>
      {items.map(item => (
        <ListGroup.Item
          key={item.id}
          style={{
            backgroundColor: item.paid ? '#d4edda' : '#ff6f61', // Verde claro para pagos realizados
            color: item.paid ? '#155724' : '#000', // Texto verde oscuro para pagos realizados
            fontFamily: 'Comic Sans MS', // Fuente retro
            fontSize: '1.2rem',
            border: '2px solid #fff',
            marginBottom: '10px',
            borderRadius: '10px',
          }}
        >
         <Row>
  <Col md={6}>
    <strong>{item.description}</strong> - ${item.amount}
  </Col>
  <Col md={6} className="text-right">
    <Button
      variant={item.paid ? 'success' : 'warning'}
      style={{
        fontFamily: 'Comic Sans MS',
        fontSize: '1rem',
        borderRadius: '8px',
        marginRight: '10px', // Añade un margen a la derecha
      }}
      onClick={() => markAsPaid(item.id)}
    >
      {item.paid ? 'No Pagado' : 'Pagado'}
    </Button>
    <Button
      variant="info"
      style={{
        fontFamily: 'Comic Sans MS',
        fontSize: '1rem',
        borderRadius: '8px',
        marginRight: '10px', // Añade un margen a la derecha
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
  </Col>
</Row>
        </ListGroup.Item>
      ))}
    </ListGroup>

    {/* Modal para agregar/editar items */}
    <Modal show={modalVisible} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontFamily: 'Comic Sans MS', fontSize: '1.5rem' }}>
          {editingItem ? 'Editar Gasto' : 'Agregar Gasto'}
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
            />
          </Form.Group>
          <Form.Group controlId="formAmount">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Monto"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            />
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
        marginRight: '40px', // Añade un margen a la derecha
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
        marginLeft: '10px', // Añade un margen a la izquierda
      }}
    >
      Eliminar
    </Button>
  </Modal.Footer>
</Modal>
  </Container>
  );
}
