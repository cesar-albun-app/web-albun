import React, { useEffect, useState } from 'react';
import { db, storage } from "../../firebase"; // Make sure storage is properly initialized in your firebase.js file
import { collection, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Import necessary functions from Firebase Storage
import { Card, Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { FaTrash, FaShareAlt, FaSearchPlus, FaDownload } from 'react-icons/fa'; // Importing Font Awesome icons
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalCustoms from '../../components/ModalCustoms'; // Import the new component

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleRemoveImage = async () => {
    if (selectedItem) {
      const { itemId, imageUrl } = selectedItem;
      try {
        // Update the document in Firestore to remove the specific image from the array
        const itemDoc = doc(db, "Albun-app", itemId);
        await updateDoc(itemDoc, {
          images: arrayRemove(imageUrl)
        });

        // Optionally, delete the image from Firebase Storage if you store images there
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        // Update the state to remove the deleted image from the selected item
        setItems((prevItems) => prevItems.map(item => {
          if (item.id === itemId) {
            return { ...item, images: item.images.filter(img => img !== imageUrl) };
          }
          return item;
        }));

        console.log(`Deleted image with ID ${itemId} and URL ${imageUrl}`);
      } catch (e) {
        console.error("Error deleting document: ", e);
      } finally {
        setShowModal(false);
      }
    }
  };

  const handleShowModal = (itemId, imageUrl) => {
    setSelectedItem({ itemId, imageUrl });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleShareImage = (image) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this image',
        text: 'Here is an image I want to share with you.',
        url: image,
      })
      .then(() => console.log('Image shared successfully'))
      .catch((error) => console.error('Error sharing image:', error));
    } else {
      console.error('Web Share API is not supported in this browser.');
      // You can add a fallback for unsupported browsers if needed
    }
  };

  const handleZoomLoadImage = (image) => {
    // Implement the download functionality here
    const link = document.createElement('a');
    link.href = image;
    link.download = 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = (image) => {
    // Implement the download functionality here
   ;
  };


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
            {items.flatMap((item) =>
              item.images.map((image, index) => (
                <Col key={`${item.id}-${index}`} md={4} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={image} alt={`Image ${index}`} />
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between align-items-center">
                        <span>{item.name} {item.surname}</span>
                        <div>
                          <Button
                            variant="danger"
                            onClick={() => handleShowModal(item.id, image)}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleShareImage(image)}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                          >
                            <FaShareAlt />
                          </Button>
                          <Button
                            variant="success"
                            onClick={() => handleZoomLoadImage(image)}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                          >
                            <FaSearchPlus />
                          </Button>
                          
                          <Button
                            variant="success"
                            onClick={() => handleDownloadImage(image)}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                          >
                            <FaDownload />
                          </Button>
                        </div>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </>
      )}

      {/* Modal for delete confirmation */}
      <ModalCustoms
        show={showModal}
        handleClose={handleCloseModal}
        handleDelete={handleRemoveImage}
        title="Confirm Deletion"
        subtitle="Are you sure you want to delete this image?"
        primaryButtonLabel="Delete"
        secondaryButtonLabel="Cancel"
      />
    </Container>
  );
}
