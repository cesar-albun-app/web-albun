import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';

const UpdateDb = ({ selectedImages, handleClearImages }) => {
  const [items, setItems] = useState([]);
  console.log("items: ", items);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Albun-app'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(data);
      } catch (e) {
        console.error('Error fetching documents: ', e);
        setError('Error fetching data from the database.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (name.trim() === '' || surname.trim() === '') {
      setError('Please enter both name and surname.');
      return;
    }

    setIsLoading(true);
    setSuccess(false);
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(selectedImages.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${new Date().getTime()}-${blob.size}`);
        await uploadBytes(storageRef, blob);
        return getDownloadURL(storageRef);
      }));

      const docRef = await addDoc(collection(db, 'Albun-app'), {
        name: name,
        surname: surname,
        images: imageUrls // Save the URLs of the images in Firestore
      });
      setItems(prevItems => [...prevItems, { id: docRef.id, name, surname, images: imageUrls }]);
      setName('');
      setSurname('');
      setError(null);
      setSuccess(true);
      handleClearImages();
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('Error adding item to the database.');
      setSuccess(false);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Enviado con éxito!</Alert>}
     
     {selectedImages.length > 0 && 
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
    <Form onSubmit={handleAddItem}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control-sm"
          style={{ maxWidth: '500px' }} // Set the maximum width of the input field
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          placeholder="Apellido"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="form-control-sm"
          style={{ maxWidth: '500px' }} // Set the maximum width of the input field
        />
      </Form.Group>
      <Button type="submit" variant="primary" disabled={isLoading || selectedImages.length === 0}>
        {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Agregar'}
      </Button>
    </Form>
  </div>
      }
    </Container>
  );
};

export default UpdateDb;
