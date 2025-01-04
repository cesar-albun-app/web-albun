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

const AppointmentScheduler = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    treatment: "",
    phone: "",
    isNewPatient: false,
    dateTime: null,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

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
      !formData.dateTime
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
      isNewPatient: appointment.isNewPatient,
      dateTime: appointment.dateTime.toDate(),
    });
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deleteDoc(doc(db, "appointments", id));
      alert("Cita eliminada correctamente.");
      fetchAppointments();
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Error al eliminar la cita.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendWhatsApp = (appointment) => {
    const phone = `549${appointment.phone}`;
    const message = `Hola ${appointment.firstName} ${appointment.lastName}, su cita para el tratamiento "${appointment.treatment}" está programada para el día ${appointment.dateTime
      .toDate()
      .toLocaleDateString()} a las ${appointment.dateTime
      .toDate()
      .toLocaleTimeString()}. Confirmaremos su turno 24 horas antes de la cita. Por favor, no dude en contactarnos si tiene alguna consulta.`
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
          appointment.dateTime.toDate().toDateString() === filterDate.toDateString()
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

      <Form onSubmit={handleSave} className="mb-4">
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
              <Form.Label>Fecha y Hora</Form.Label>
              <DatePicker
                selected={formData.dateTime}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
              />
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
        <Button type="submit" variant="primary" className="mt-3">
          {editingAppointment ? "Actualizar" : "Agendar"}
        </Button>
      </Form>

      <div className="mb-4">
        <h5>Filtrar citas por fecha</h5>
        <DatePicker
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          className="form-control"
          placeholderText="Seleccionar fecha"
        />
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="table-responsive">
          <Table bordered>
            <thead style={{ backgroundColor: "#9188c2", color: "#fff" }}>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Tratamiento</th>
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
                  <tr key={appointment.id}>
                    <td>{appointment.firstName}</td>
                    <td>{appointment.lastName}</td>
                    <td>{appointment.phone}</td>
                    <td>{appointment.treatment}</td>
                    <td>{appointment.isNewPatient ? "Nuevo" : "Regular"}</td>
                    <td>{date.toLocaleDateString()}</td>
                    <td>{date.toLocaleTimeString()}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(appointment)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleSendWhatsApp(appointment)}
                      >
                        WhatsApp
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AppointmentScheduler;