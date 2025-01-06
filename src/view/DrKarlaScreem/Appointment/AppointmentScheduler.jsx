import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Container,
  Form,
  Button,
  Table,
  Spinner,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash, FaWhatsapp, FaCalendarAlt } from "react-icons/fa"; // Importar íconos

const AppointmentScheduler = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    treatment: "",
    phone: "",
    cost: "", // Nuevo campo para el costo
    isNewPatient: false,
    dateTime: null,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const appointmentsCollection = collection(db, "appointments");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isNewPatient: e.target.checked });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateTime: date });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.dateTime ||
      !formData.cost
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    setIsActionLoading(true);
    try {
      if (editingAppointment) {
        const docRef = doc(db, "appointments", editingAppointment);
        await updateDoc(docRef, {
          ...formData,
          dateTime: Timestamp.fromDate(formData.dateTime),
        });
        alert("Cita actualizada correctamente.");
        setEditingAppointment(null);
      } else {
        await addDoc(appointmentsCollection, {
          ...formData,
          dateTime: Timestamp.fromDate(formData.dateTime),
        });
        alert("Cita registrada correctamente.");
      }

      setFormData({
        firstName: "",
        lastName: "",
        treatment: "",
        phone: "",
        cost: "",
        isNewPatient: false,
        dateTime: null,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      alert("Error al guardar la cita.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment.id);
    setFormData({
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      treatment: appointment.treatment,
      phone: appointment.phone,
      cost: appointment.cost,
      isNewPatient: appointment.isNewPatient,
      dateTime: appointment.dateTime.toDate(),
    });
  };

  const handleDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    setIsActionLoading(true);
    try {
      await deleteDoc(doc(db, "appointments", appointmentToDelete.id));
      fetchAppointments();
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Error al eliminar la cita.");
    } finally {
      setIsActionLoading(false);
      setShowDeleteModal(false);
      setAppointmentToDelete(null);
    }
  };

  const handleSendWhatsApp = (appointment) => {
    const phone = `549${appointment.phone}`;
    const message = `Hola ${appointment.firstName} ${
      appointment.lastName
    }, su cita para el tratamiento con la Dra Karla Leañez "${
      appointment.treatment
    }" está programada para el día ${appointment.dateTime
      .toDate()
      .toLocaleDateString()} a las ${appointment.dateTime
      .toDate()
      .toLocaleTimeString()}. El costo del tratamiento es de ${
      appointment.cost
    }. Confirmaremos su turno 24 horas antes de la cita. Por favor, no dude en contactarnos si tiene alguna consulta. Nos vemos en Conesa 3074 planta baja apt A.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = query(appointmentsCollection);
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = filterDate
    ? appointments.filter(
        (appointment) =>
          appointment.dateTime.toDate().toDateString() ===
          filterDate.toDateString()
      )
    : appointments;

  return (
    <Container className="pt-4">
      <h2 className="text-center mb-4">Agendar Pacientes</h2>

      {isActionLoading && (
        <Modal
          show={isActionLoading}
          centered
          backdrop="static"
          keyboard={false}
          style={{ textAlign: "center" }}
        >
          <Modal.Body>
            <Spinner animation="border" variant="primary" />
            <p>Cargando...</p>
          </Modal.Body>
        </Modal>
      )}
      {/* Modal de Confirmación de Eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar esta cita? Esta acción no se puede
          deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Form onSubmit={handleSave} className="mb-4">
        <div
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            backgroundColor: "#fff",
            marginBottom: "20px",
          }}
        >
          <Row className="gy-2">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Tratamiento</Form.Label>
                <Form.Control
                  type="text"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Costo</Form.Label>
                <Form.Control
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Fecha y Hora</Form.Label>
                <div className="d-flex align-items-center">
                  <FaCalendarAlt
                    style={{
                      fontSize: "1.5rem",
                      marginRight: "10px",
                      color: "#6c63ff",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      document.getElementById("datepicker-input").focus()
                    } // Foco al campo al hacer clic en el ícono
                  />
                  <DatePicker
                    id="datepicker-input"
                    selected={formData.dateTime}
                    onChange={handleDateChange}
                    showTimeSelect
                    dateFormat="Pp"
                    className="form-control"
                    placeholderText="Seleccionar fecha y hora"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="¿Es paciente nuevo?"
                  checked={formData.isNewPatient}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" 
          
          style={{ background:"#6c63ff",  color: "white",}}
          
          className="mt-3">
            {editingAppointment ? "Actualizar" : "Agendar"}
          </Button>
        </div>
      </Form>

      <div className="mb-4">
  <h5>Filtrar citas por fecha</h5>
  <div className="d-flex align-items-center">
    <FaCalendarAlt
      style={{
        fontSize: "1.5rem",
        marginRight: "10px",
        color: "#6c63ff",
        cursor: "pointer",
      }}
      onClick={() => document.getElementById("filter-datepicker").focus()} // Foco al campo al hacer clic en el ícono
    />
    <DatePicker
      id="filter-datepicker"
      selected={filterDate}
      onChange={(date) => setFilterDate(date)}
      className="form-control"
      placeholderText="Seleccionar fecha"
    />
  </div>
</div>

      {loading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <Spinner animation="border" variant="primary" />
          <p
            style={{ marginTop: "10px", fontSize: "1.2rem", color: "#6c63ff" }}
          >
            Actualizando...
          </p>
        </div>
      ) : (
        <div
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            backgroundColor: "#fff",
            marginBottom: "20px",
          }}
        >
          <div className="table-responsive">
            <Table
              bordered
              className="shadow-sm"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#6c63ff",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Tratamiento</th>
                  <th>Costo</th>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => {
                  const date = appointment.dateTime.toDate();
                  return (
                    <tr
                      key={appointment.id}
                      style={{
                        textAlign: "center",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <td>{appointment.firstName}</td>
                      <td>{appointment.lastName}</td>
                      <td>{appointment.phone}</td>
                      <td>{appointment.treatment}</td>
                      <td>{appointment.cost}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: appointment.isNewPatient
                              ? "#28a745"
                              : "#6c757d",
                          }}
                        >
                          {appointment.isNewPatient ? "Nuevo" : "Regular"}
                        </span>
                      </td>
                      <td>{date.toLocaleDateString()}</td>
                      <td>{date.toLocaleTimeString()}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="me-2 btn-hover-warning"
                          onClick={() => handleEdit(appointment)}
                        >
                          <FaEdit
                            style={{
                              marginRight: "5px",
                              marginBottom: 5,
                              color: "white",
                            }}
                          />
                          Editar
                        </Button>

                        <Button
                          variant="danger"
                          className="me-2"
                          onClick={() => handleDeleteModal(appointment)}
                        >
                          <FaTrash
                            style={{
                              marginRight: "5px",
                              marginBottom: 5,
                              color: "white",
                            }}
                          />
                          Eliminar
                        </Button>

                        <Button
                          variant="success"
                          onClick={() => handleSendWhatsApp(appointment)}
                        >
                          <FaWhatsapp
                            style={{
                              marginRight: "5px",
                              marginBottom: 5,
                              color: "white",
                            }}
                          />
                          WhatsApp
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AppointmentScheduler;
