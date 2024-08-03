import React, { useEffect, useState } from 'react';
import { db, storage } from "../../firebase"; // Make sure storage is properly initialized in your firebase.js file
import { collection, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Import necessary functions from Firebase Storage
import { Card, Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import { FaTrash, FaShareAlt, FaSearchPlus, FaDownload } from 'react-icons/fa'; // Importing Font Awesome icons
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalCustoms from '../../components/ModalCustoms'; // Import the new component

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Albun-app"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching documents: ", e);
        setError("Error fetching data from the database.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    const link = document.createElement('a');
    link.href = image;
    link.download = 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage * pageSize < items.length ? prevPage + 1 : prevPage));
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status" style={{ width: '5rem', height: '5rem' }}>
          </Spinner>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Row>
            {currentItems.flatMap((item) =>
              item.images.map((image, index) => (
                <Col key={`${item.id}-${index}`} md={4} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={image} alt={`Image ${index}`} />
                    <Card.Body>
                      <Card.Title className="d-flex flex-column align-items-center">
                        <div className="text-center mb-2" style={{ wordWrap: 'break-word', maxWidth: '100%' }}>
                          <span>{item.name} {item.surname}</span>
                        </div>
                        <div>
                          <Button 
                            variant="danger"
                            onClick={() => handleShowModal(item.id, image)}
                            className="mx-1"
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleShareImage(image)}
                            className="mx-1"
                          >
                            <FaShareAlt />
                          </Button>
                          <Button
                            variant="success"
                            onClick={() => handleZoomLoadImage(image)}
                            className="mx-1"
                          >
                            <FaSearchPlus />
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleDownloadImage(image)}
                            className="mx-1"
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
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
            <Form.Group controlId="pageSize" className="mb-0 d-flex align-items-center">
              <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Control>
            </Form.Group>
            <Button onClick={handleNextPage} disabled={indexOfLastItem >= items.length}>Next</Button>
          </div>
        </>
      )}

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
