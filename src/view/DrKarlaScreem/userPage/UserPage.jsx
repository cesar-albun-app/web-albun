import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Card,
  Button,
  Modal,
  Form,
  Spinner,
  Row,
  Col,
  Offcanvas,
  Nav,
  Table
} from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import "./UserPage.css";
import PatientTable from './PatientTable'

const UserPage = () => {
  const [patients, setPatients] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar el menú lateral

  const [consultations, setConsultations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [isEditConsultationMode, setIsEditConsultationMode] = useState(false);
  const [editingConsultationId, setEditingConsultationId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "", // Nuevo campo de correo
    image: null,
    details: "",
  });
  const [newConsultation, setNewConsultation] = useState({
    date: "",
    details: "",
    amountPaid: "",
    treatment: "",
    pendingAmount: "",
    nextConsultationDate: "",
    image1: null,
    image2: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  const patientsCollection = collection(db, "Patients");

  // Fetch patients from Firestore
  const fetchPatients = async () => {
    try {
      const querySnapshot = await getDocs(patientsCollection);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch consultations for a specific patient
  const fetchConsultations = async (patientId) => {
    try {
      const consultationsCollection = collection(
        db,
        `Patients/${patientId}/Consultations`
      );
      const querySnapshot = await getDocs(consultationsCollection);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const handleSaveConsultation = async () => {
    setIsSaving(true); // Activar el estado de guardado
  
    const {
      date,
      details,
      amountPaid,
      treatment,
      pendingAmount,
      nextConsultationDate,
      image1,
      image2,
    } = newConsultation;
  
    try {
      const consultationsCollection = collection(
        db,
        `Patients/${selectedPatient.id}/Consultations`
      );
  
      let image1Url = null;
      let image2Url = null;
  
      // Subir imágenes si existen
      if (image1 instanceof File) {
        const image1Ref = ref(
          storage,
          `consultations/${selectedPatient.id}/${image1.name}`
        );
        await uploadBytes(image1Ref, image1);
        image1Url = await getDownloadURL(image1Ref);
      }
  
      if (image2 instanceof File) {
        const image2Ref = ref(
          storage,
          `consultations/${selectedPatient.id}/${image2.name}`
        );
        await uploadBytes(image2Ref, image2);
        image2Url = await getDownloadURL(image2Ref);
      }
  
      const consultationData = {
        date: date || null,
        details: details || null,
        amountPaid: amountPaid || null,
        treatment: treatment || null,
        pendingAmount: pendingAmount || null,
        nextConsultationDate: nextConsultationDate || null,
        image1: image1Url,
        image2: image2Url,
      };
  
      if (isEditConsultationMode) {
        const consultationRef = doc(
          db,
          `Patients/${selectedPatient.id}/Consultations/${editingConsultationId}`
        );
        await updateDoc(consultationRef, consultationData);
        alert("Consulta actualizada con éxito.");
      } else {
        await addDoc(consultationsCollection, consultationData);
        alert("Consulta agregada con éxito.");
      }
  
      setShowConsultationModal(false);
      setNewConsultation({
        date: "",
        details: "",
        amountPaid: "",
        treatment: "",
        pendingAmount: "",
        nextConsultationDate: "",
        image1: null,
        image2: null,
      });
      fetchConsultations(selectedPatient.id);
    } catch (error) {
      console.error("Error saving consultation:", error);
      alert("Hubo un problema al guardar la consulta.");
    } finally {
      setIsSaving(false); // Desactivar el estado de guardado
    }
  };

  // Delete a consultation
  const handleDeleteConsultation = async (consultationId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta consulta?")) {
      try {
        const consultationRef = doc(
          db,
          `Patients/${selectedPatient.id}/Consultations/${consultationId}`
        );
        await deleteDoc(consultationRef);
        alert("Consulta eliminada con éxito.");
        fetchConsultations(selectedPatient.id);
      } catch (error) {
        console.error("Error deleting consultation:", error);
      }
    }
  };

  // Open the modal for editing a consultation
  const handleEditConsultation = (consultation) => {
    console.log("consultation: ", consultation);

    setIsEditConsultationMode(true);
    setEditingConsultationId(consultation.id);
    setNewConsultation({
      date: consultation.date || "",
      details: consultation.details || "",
      amountPaid: consultation.amountPaid || "",
      treatment: consultation.treatment || "",
      pendingAmount: consultation.pendingAmount || "",
      nextConsultationDate: consultation.nextConsultationDate || "",
      image1: consultation.image1 || null,
      image2: consultation.image2 || null,
    });
    setShowConsultationModal(true);
  };

  // Add or update a patient
  const handleSavePatient = async () => {
    const { firstName, lastName, age, phone, email, image, details } = newPatient;
  
    if (!firstName || !lastName || !age || !phone || !email || !details) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    setIsSaving(true);
  
    try {
      let imageUrl = newPatient.image;
      if (image instanceof File) {
        const imageRef = ref(storage, `patients/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      if (isEditMode) {
        const patientRef = doc(db, "Patients", editingPatientId);
        await updateDoc(patientRef, {
          firstName,
          lastName,
          age,
          phone,
          email, // Guardar el correo electrónico
          image: imageUrl,
          details,
        });
        alert("Paciente actualizado con éxito.");
      } else {
        await addDoc(patientsCollection, {
          firstName,
          lastName,
          age,
          phone,
          email, // Guardar el correo electrónico
          image: imageUrl,
          details,
        });
        alert("Paciente agregado con éxito.");
      }
  
      setShowModal(false);
      setNewPatient({
        firstName: "",
        lastName: "",
        age: "",
        phone: "",
        email: "", // Restablecer el campo de correo
        image: null,
        details: "",
      });
      fetchPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Hubo un problema al guardar el paciente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a patient
  const handleDeletePatient = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      try {
        const patientRef = doc(db, "Patients", id);
        await deleteDoc(patientRef);
        alert("Paciente eliminado con éxito.");
        fetchPatients();
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  // Open the modal for editing a patient
  const handleEditPatient = (patient) => {
    setIsEditMode(true);
    setEditingPatientId(patient.id);
    setNewPatient({
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      phone: patient.phone,
      image: patient.image,
      details: patient.details,
      email:patient.email,
    });
    setShowModal(true);
  };

  // Open the sidebar for patient details
  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowSidebar(true);
    fetchConsultations(patient.id);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="patient-list-container">
      <div className="menu-icon">
        <Button
          variant="light"
          className="hamburger-button"
          onClick={() => setShowMenu(true)}
        >
          <FaBars size={24} />
        </Button>
      </div>

      {/* Menú lateral */}
      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/scheduler">Turnos</Nav.Link>
            <Nav.Link href="/docKarla">Mi Tienda</Nav.Link>
            <Nav.Link href="/dashboard">Salir</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <h3 className="page-title">Lista de Pacientes</h3>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => {
          setIsEditMode(false);
          setNewPatient({
            firstName: "",
            lastName: "",
            age: "",
            phone: "",
            image: null,
            details: "",
          });
          setShowModal(true);
        }}
      >
        Agregar Paciente
      </Button>

      <PatientTable patients={patients} handleEditPatient={handleEditPatient} handleDeletePatient={handleDeletePatient} handleViewDetails={handleViewDetails}    />

     

      {/* Sidebar para ver detalles */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Detalles del Paciente</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedPatient && (
            <>
              <h5>{`${selectedPatient.firstName} ${selectedPatient.lastName}`}</h5>
              <p>
                <strong>Edad:</strong> {selectedPatient.age}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedPatient.phone}
              </p>
              <p>
                <strong>Detalles:</strong> {selectedPatient.details}
              </p>
              <Button
                variant="success"
                onClick={() => {
                  setIsEditConsultationMode(false);
                  setNewConsultation({ date: "", details: "", amountPaid: "" });
                  setShowConsultationModal(true);
                }}
                className="mb-3"
              >
                Crear Consulta
              </Button>
              <h6>Consultas</h6>
              {consultations.length > 0 ? (
                consultations.map((consultation) => (
                  <Card className="mb-2" key={consultation.id}>
                    <Card.Body>
                      <Card.Text>
                        <strong>Detalles:</strong> {consultation.details}
                        <br />
                        <strong>Tratamiento:</strong> {consultation.treatment}
                        <br />
                        <strong>Monto Pagado:</strong> $
                        {consultation.amountPaid}
                        <br />
                        <strong>Monto Pendiente:</strong> $
                        {consultation.pendingAmount}
                        <br />
                        <strong>Próxima Consulta:</strong>{" "}
                        {consultation.nextConsultationDate}
                        <br />
                          <strong>Fecha:</strong>{" "}
                        {consultation.date}
                        <br />
                        {consultation.image1 && (
                          <img
                            src={consultation.image1}
                            alt="Imagen 1"
                            style={{ width: "100%", marginTop: "10px" }}
                          />
                        )}
                        {consultation.image2 && (
                          <img
                            src={consultation.image2}
                            alt="Imagen 2"
                            style={{ width: "100%", marginTop: "10px" }}
                          />
                        )}
                      </Card.Text>
                      <div className="card-buttons">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleEditConsultation(consultation)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteConsultation(consultation.id)
                          }
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No hay consultas registradas.</p>
              )}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modal para crear o editar consulta */}
      <Modal show={showConsultationModal} onHide={() => setShowConsultationModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>
      {isEditConsultationMode ? "Editar Consulta" : "Crear Consulta"}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group>
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          value={newConsultation.date}
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, date: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Detalles</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={newConsultation.details}
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, details: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Tratamiento</Form.Label>
        <Form.Control
          type="text"
          value={newConsultation.treatment}
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, treatment: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Monto Pagado</Form.Label>
        <Form.Control
          type="number"
          value={newConsultation.amountPaid}
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, amountPaid: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Monto Pendiente</Form.Label>
        <Form.Control
          type="number"
          value={newConsultation.pendingAmount}
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, pendingAmount: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Próxima Consulta</Form.Label>
        <Form.Control
          type="date"
          value={newConsultation.nextConsultationDate}
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, nextConsultationDate: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Foto 1</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, image1: e.target.files[0] })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Foto 2</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewConsultation({ ...newConsultation, image2: e.target.files[0] })
          }
        />
      </Form.Group>
      <Button
        onClick={handleSaveConsultation}
        className="mt-3"
        variant="success"
        disabled={isSaving} // Desactiva el botón mientras se está guardando
      >
        {isSaving ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Guardando...
          </>
        ) : isEditConsultationMode ? (
          "Guardar Cambios"
        ) : (
          "Guardar Consulta"
        )}
      </Button>
    </Form>
  </Modal.Body>
</Modal>
      {/* Modal para agregar o editar paciente */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Editar Paciente" : "Agregar Paciente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newPatient.firstName}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, firstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={newPatient.lastName}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, lastName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, age: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
  <Form.Label>Correo Electrónico</Form.Label>
  <Form.Control
    type="email"
    value={newPatient.email}
    onChange={(e) =>
      setNewPatient({ ...newPatient, email: e.target.value })
    }
  />
</Form.Group>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={newPatient.phone}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewPatient({ ...newPatient, image: e.target.files[0] })
                }
              />
              {isEditMode && typeof newPatient.image === "string" && (
                <img
                  src={newPatient.image}
                  alt="Preview"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Detalles</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newPatient.details}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, details: e.target.value })
                }
              />
            </Form.Group>
            <Button
              onClick={handleSavePatient}
              className="mt-3"
              variant="success"
              disabled={isSaving}
            >
              {isSaving ? <Spinner animation="border" size="sm" /> : "Guardar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserPage;
