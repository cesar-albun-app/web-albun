import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { Calendar } from "react-calendar";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import "./SchedulerTable.css";
import { FaCheckCircle } from "react-icons/fa"; // Ícono de disponibilidad

const UserScheduler = ({domain})  => {
  const [daySchedules, setDaySchedules] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    email: "",
    phone: "", // Nuevo campo para el teléfono
    time: "",
  });
  const [isBooking, setIsBooking] = useState(false);


  const fetchSchedulerDays = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `applicationsBase/schedulers/${domain}`));
     
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const schedules = {};
      data.forEach((entry) => {
        schedules[entry.date] = entry.slots || [];
      });
      setDaySchedules(schedules);
    } catch (error) {
      console.error("Error al cargar días de Scheduler:", error);
    }
  };

  const handleBookAppointment = async () => {
    if (
      !bookingInfo.name ||
      !bookingInfo.email ||
      !bookingInfo.phone ||
      !bookingInfo.time
    ) {
      alert("Por favor, completa toda la información.");
      return;
    }
  
    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingInfo.email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }
  
    setIsBooking(true); // Mostrar el spinner
    const dayString = selectedDay.date.toISOString().split("T")[0];
    const updatedSchedules = daySchedules[dayString].map((slot) =>
      slot.time === bookingInfo.time
        ? {
            ...slot,
            isAvailable: false,
            user: {
              name: bookingInfo.name,
              email: bookingInfo.email,
              phone: bookingInfo.phone, // Agregar el teléfono
            },
          }
        : slot
    );
  
    try {
    const docRef = doc(db, `applicationsBase/schedulers/${domain}`, dayString);
      
  
      await updateDoc(docRef, { slots: updatedSchedules }).catch(async () => {
        await setDoc(docRef, { date: dayString, slots: updatedSchedules });
      });
  
      setDaySchedules((prevSchedules) => ({
        ...prevSchedules,
        [dayString]: updatedSchedules,
      }));
  
      alert("Turno reservado con éxito.");
    } catch (error) {
      console.error("Error al reservar turno en Scheduler:", error);
      alert(
        "Hubo un problema al reservar el turno. Por favor, inténtalo nuevamente."
      );
    } finally {
      setIsBooking(false); // Ocultar el spinner
      setShowBookingModal(false);
      setBookingInfo({ name: "", email: "", phone: "", time: "" });
    }
  };

  useEffect(() => {
    fetchSchedulerDays();
  }, []);

  return (
    <>
      <div className="calendar-legend">
        <FaCheckCircle className="legend-icon" />
        <span className="legend-text">
          Los días con turnos disponibles están marcados con este ícono.
        </span>
      </div>
      <div className="week-selector-container">
        <h5 className="week-selector-title">Selecciona una semana</h5>

        <Calendar
          className="custom-calendar mb-4"
          tileContent={({ date }) => {
            const dayString = date.toISOString().split("T")[0];
            const slots = daySchedules[dayString] || [];
            const availableSlots = slots.filter((slot) => slot.isAvailable);
            return (
              availableSlots.length > 0 && (
                <span style={{ color: "green" }}>
                  <FaCheckCircle /> {/* Ícono de disponibilidad */}
                </span>
              )
            );
          }}
          onClickDay={(date) => {
            const dayString = date.toISOString().split("T")[0];
            if (daySchedules[dayString]) {
              setSelectedDay({ date });
            }
          }}
        />
      </div>

      {selectedDay && (
        <>
          <>
            <h5 className="schedule-title">
              Selecciona un horario para {selectedDay.date.toLocaleDateString()}
            </h5>
            {daySchedules[selectedDay.date.toISOString().split("T")[0]]?.some(
              (slot) => slot.isAvailable
            ) ? (
              <Table bordered hover responsive className="modern-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {daySchedules[
                    selectedDay.date.toISOString().split("T")[0]
                  ].map(
                    (slot, index) =>
                      slot.isAvailable && (
                        <tr key={index}>
                          <td>{slot.time}</td>
                          <td>Disponible</td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => {
                                setBookingInfo({
                                  ...bookingInfo,
                                  time: slot.time,
                                });
                                setShowBookingModal(true);
                              }}
                            >
                              Reservar
                            </Button>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </Table>
            ) : (
              <p className="no-schedule-message">
                Turno no disponible para la fecha seleccionada.
              </p>
            )}
          </>
        </>
      )}

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservar turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={bookingInfo.name}
                onChange={(e) =>
                  setBookingInfo({ ...bookingInfo, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={bookingInfo.email}
                onChange={(e) =>
                  setBookingInfo({ ...bookingInfo, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={bookingInfo.phone}
                onChange={(e) =>
                  setBookingInfo({ ...bookingInfo, phone: e.target.value })
                }
              />
            </Form.Group>
            <Button
              onClick={handleBookAppointment}
              className="mt-3"
              variant="success"
              disabled={isBooking} // Deshabilitar el botón mientras se procesa
            >
              {isBooking ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Confirmar"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserScheduler;
