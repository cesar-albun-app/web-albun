import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import { Calendar } from "react-calendar";
import { Spinner, Table, Button, Modal,Accordion } from "react-bootstrap";
import "./SchedulerTable.css"; 

const AdminScheduler = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [daySchedules, setDaySchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [currentDayKey, setCurrentDayKey] = useState(null); // Nuevo estado para identificar el día actual
  const [isCancelling, setIsCancelling] = useState(false); 

  const schedulerCollection = collection(db, "Scheduler");
  const hours = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

  const generateWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return { date: day, isWorking: false };
    });
    setDaysOfWeek(weekDays);

    const initialSchedules = { ...daySchedules };
    weekDays.forEach((day) => {
      const dayString = day.date.toISOString().split("T")[0];
      if (!initialSchedules[dayString]) {
        initialSchedules[dayString] = hours.map((hour) => ({
          time: hour,
          isAvailable: false,
          user: null,
        }));
      }
    });
    setDaySchedules(initialSchedules);
  };

  const fetchSchedulerDays = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(schedulerCollection);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const schedules = {};
      data.forEach((entry) => {
        schedules[entry.date] = entry.slots || [];
      });
      setDaySchedules((prevSchedules) => ({ ...prevSchedules, ...schedules }));
    } catch (error) {
      console.error("Error al cargar días de Scheduler:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedulerDays = async () => {
    setIsSaving(true);
    try {
      const dayEntries = Object.entries(daySchedules).map(([date, slots]) => ({
        date,
        slots,
      }));

      for (const entry of dayEntries) {
        const docRef = doc(db, "Scheduler", entry.date);
        await updateDoc(docRef, { slots: entry.slots }).catch(async () => {
          await setDoc(docRef, { date: entry.date, slots: entry.slots });
        });
      }

      alert("Horarios guardados correctamente en Scheduler.");
    } catch (error) {
      console.error("Error al guardar horarios en Scheduler:", error);
    } finally {
      setIsSaving(false);
      fetchSchedulerDays();
    }
  };

  const handleCancelTurn = async () => {
    if (!currentDayKey || !reservationDetails) return;
    setIsCancelling(true); 

    const updatedSchedules = daySchedules[currentDayKey].map((slot) =>
      slot.time === reservationDetails.time
        ? { ...slot, isAvailable: false, user: null }
        : slot
    );

    try {
      const docRef = doc(db, "Scheduler", currentDayKey);
      await updateDoc(docRef, { slots: updatedSchedules });
      setDaySchedules((prevSchedules) => ({
        ...prevSchedules,
        [currentDayKey]: updatedSchedules,
      }));
      alert("Turno cancelado correctamente.");
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
    } finally {
      
      setShowDetailsModal(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (reservationDetails?.phone) {
      const message = `Hola ${reservationDetails.email}, su turno reservado para el ${reservationDetails.date} a las ${reservationDetails.time} sigue en pie. Si tiene alguna consulta, contáctenos.`;
      const url = `https://wa.me/549${reservationDetails.phone}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    } else {
      alert("El usuario no tiene un número de teléfono asociado.");
    }
  };

  const handleToggleAvailability = async (day, hourIndex) => {
    const dayString = day.date.toISOString().split("T")[0];
    const updatedSchedules = daySchedules[dayString].map((slot, index) => {
      if (index === hourIndex) {
        if (slot.user) {
          return { ...slot, isAvailable: true, user: null };
        }
        return { ...slot, isAvailable: !slot.isAvailable };
      }
      return slot;
    });

    setDaySchedules((prevSchedules) => ({
      ...prevSchedules,
      [dayString]: updatedSchedules,
    }));

    try {
      const docRef = doc(db, "Scheduler", dayString);
      await updateDoc(docRef, { slots: updatedSchedules }).catch(async () => {
        await setDoc(docRef, { date: dayString, slots: updatedSchedules });
      });
      console.log("Turno actualizado en Firestore");
    } catch (error) {
      console.error("Error al actualizar el turno en Firestore:", error);
    }
  };

  const handleShowDetails = (dayString, slot) => {
    if (slot.user) {
      setReservationDetails({
        date: dayString,
        time: slot.time,
        email: slot.user.email,
        phone: slot.user.phone,
      });
      setCurrentDayKey(dayString); // Establecer el día actual
      setShowDetailsModal(true);
    }
  };

  useEffect(() => {
    generateWeekDays(selectedWeek);
    fetchSchedulerDays();
  }, [selectedWeek]);

  return (
    <>
      <h5>Selecciona una semana</h5>
      <div className="week-selector-container">
      <h5 className="week-selector-title">Selecciona una semana</h5>
      <Calendar
        onChange={(date) => setSelectedWeek(date)}
        value={selectedWeek}
        view="month"
        className="custom-calendar mb-4"
      />
    </div>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          {daysOfWeek.map((day, index) => {
            const dayKey = day.date.toISOString().split("T")[0];
            const slots = daySchedules[dayKey] || [];

            return (
              <Accordion defaultActiveKey="0" className="mb-3 shadow-sm rounded">
              <Accordion.Item eventKey={dayKey}>
                <Accordion.Header>
                  <strong>{day.date.toLocaleDateString()}</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <Table bordered hover responsive className="modern-table">
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Usuario</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot, slotIndex) => (
                        <tr key={slotIndex}>
                          <td>{slot.time}</td>
                          <td>
                            {slot.user
                              ? "Solicitado"
                              : slot.isAvailable
                              ? "Disponible"
                              : "Deshabilitado"}
                          </td>
                          <td>
                            {slot.user
                              ? `${slot.user.name} (${slot.user.email})`
                              : "N/A"}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant={
                                slot.user
                                  ? "warning"
                                  : slot.isAvailable
                                  ? "success"
                                  : "danger"
                              }
                              className="action-button"
                              onClick={() =>
                                slot.user
                                  ? handleShowDetails(dayKey, slot)
                                  : handleToggleAvailability(day, slotIndex)
                              }
                            >
                              {slot.user
                                ? "Ver detalles"
                                : slot.isAvailable
                                ? "Deshabilitar"
                                : "Habilitar"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            );
          })}
          <Button
            onClick={handleSaveSchedulerDays}
            className="mt-4"
            variant="primary"
          >
            {isSaving ? <Spinner animation="border" size="sm" /> : "Guardar Horarios"}

          </Button>
        </>
      )}

      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservationDetails ? (
            <>
              <p>
                <strong>Fecha:</strong> {reservationDetails.date}
              </p>
              <p>
                <strong>Hora:</strong> {reservationDetails.time}
              </p>
              <p>
                <strong>Correo:</strong> {reservationDetails.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {reservationDetails.phone}
              </p>
            </>
          ) : (
            <p>No hay detalles disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancelTurn}>
            Cancelar Turno
          </Button>
          <Button variant="success" onClick={handleSendWhatsApp}>
            Enviar WhatsApp
          </Button>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminScheduler;