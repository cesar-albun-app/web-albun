import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import { Container, Button, Spinner, Table, Form, Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Scheduler = () => {
  const [role, setRole] = useState("admin"); // Cambia entre "admin" y "user"
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [daySchedules, setDaySchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ name: "", email: "", time: "" });

  const workDaysCollection = collection(db, "workDays");
  const hours = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`); // Horarios de 9:00 a 20:00

  const generateWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return { date: day, isWorking: false };
    });
    setDaysOfWeek(weekDays);

    // Generar horarios para cada día si no existen
    const initialSchedules = { ...daySchedules };
    weekDays.forEach((day) => {
      const dayString = day.date.toISOString().split("T")[0];
      if (!initialSchedules[dayString]) {
        initialSchedules[dayString] = hours.map((hour) => ({
          time: hour,
          isAvailable: false, // Solo habilitados por el administrador estarán disponibles
          user: null, // Campo para guardar datos del usuario que reservó
        }));
      }
    });
    setDaySchedules(initialSchedules);
  };

  const fetchWorkDays = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(workDaysCollection);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Actualizar horarios desde Firebase
      const schedules = {};
      data.forEach((entry) => {
        schedules[entry.date] = entry.slots || [];
      });
      setDaySchedules((prevSchedules) => ({ ...prevSchedules, ...schedules }));
    } catch (error) {
      console.error("Error al cargar días de trabajo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkDays = async () => {
    setIsSaving(true);
    try {
      const dayEntries = Object.entries(daySchedules).map(([date, slots]) => ({
        date,
        slots,
      }));

      for (const entry of dayEntries) {
        const docRef = doc(db, "workDays", entry.date);
        await updateDoc(docRef, { slots: entry.slots }).catch(async () => {
          await setDoc(docRef, { date: entry.date, slots: entry.slots });
        });
      }

      alert("Horarios guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar horarios:", error);
    } finally {
      setIsSaving(false);
      fetchWorkDays();
    }
  };

  const handleToggleAvailability = (day, hourIndex) => {
    const dayString = day.date.toISOString().split("T")[0];
    setDaySchedules((prevSchedules) => ({
      ...prevSchedules,
      [dayString]: prevSchedules[dayString].map((slot, index) =>
        index === hourIndex ? { ...slot, isAvailable: !slot.isAvailable } : slot
      ),
    }));
  };

  const handleBookAppointment = async () => {
    if (!bookingInfo.name || !bookingInfo.email || !bookingInfo.time) {
      alert("Por favor, completa toda la información.");
      return;
    }

    const dayString = selectedDay.date.toISOString().split("T")[0];
    const updatedSchedules = daySchedules[dayString].map((slot) =>
      slot.time === bookingInfo.time
        ? {
            ...slot,
            isAvailable: false,
            user: { name: bookingInfo.name, email: bookingInfo.email },
          }
        : slot
    );

    try {
      const docRef = doc(db, "workDays", dayString);

      // Usar setDoc para crear o actualizar el documento
      await updateDoc(docRef, { slots: updatedSchedules }).catch(async (error) => {
        console.warn("El documento no existe, se intentará crear.");
        await setDoc(docRef, { date: dayString, slots: updatedSchedules });
      });

      // Actualizar el estado local
      setDaySchedules((prevSchedules) => ({
        ...prevSchedules,
        [dayString]: updatedSchedules,
      }));

      alert("Turno reservado con éxito.");
    } catch (error) {
      console.error("Error al reservar turno:", error);
      alert("Hubo un problema al reservar el turno. Por favor, inténtalo nuevamente.");
    } finally {
      setShowBookingModal(false);
      setBookingInfo({ name: "", email: "", time: "" });
    }
  };

  useEffect(() => {
    generateWeekDays(selectedWeek);
    fetchWorkDays();
  }, [selectedWeek]);

  return (
    <Container className="pt-4">
      <h2 className="text-center mb-4">Gestión de Agenda</h2>
      <Button
        onClick={() => setRole((prev) => (prev === "admin" ? "user" : "admin"))}
        className="mb-4"
      >
        Cambiar a {role === "admin" ? "Usuario" : "Administrador"}
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : role === "admin" ? (
        <>
          <h5>Selecciona una semana</h5>
          <Calendar
            onChange={(date) => setSelectedWeek(date)}
            value={selectedWeek}
            view="month"
            className="mb-4"
          />
          <h5>Días de la semana seleccionada</h5>
          {daysOfWeek.map((day, index) => {
            const dayKey = day.date.toISOString().split("T")[0];
            const slots = daySchedules[dayKey] || []; // Proporcionar un array vacío si no existe

            return (
              <div key={index} className="mb-3">
                <h6>{day.date.toLocaleDateString()}</h6>
                <Table bordered>
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
                        <td>{slot.isAvailable ? "Disponible" : "Reservado"}</td>
                        <td>
                          {slot.user
                            ? `${slot.user.name} (${slot.user.email})`
                            : "N/A"}
                        </td>
                        <td>
                          <Button
                            variant={slot.isAvailable ? "success" : "danger"}
                            size="sm"
                            onClick={() => handleToggleAvailability(day, slotIndex)}
                          >
                            {slot.isAvailable ? "Habilitar" : "Deshabilitar"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            );
          })}
          <Button onClick={handleSaveWorkDays} className="mt-4" variant="primary">
            Guardar Horarios
          </Button>
        </>
      ) : (
        <>
          <h5>Calendario de disponibilidad</h5>
          <Calendar
            tileContent={({ date }) => {
              const dayString = date.toISOString().split("T")[0];
              const slots = daySchedules[dayString] || [];
              const availableSlots = slots.filter((slot) => slot.isAvailable);
              return (
                availableSlots.length > 0 && (
                  <span style={{ color: "green" }}>✔</span>
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

          {selectedDay && (
            <>
              <h5>Selecciona un horario para {selectedDay.date.toLocaleDateString()}</h5>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {daySchedules[selectedDay.date.toISOString().split("T")[0]].map(
                    (slot, index) =>
                      slot.isAvailable && (
                        <tr key={index}>
                          <td>{slot.time}</td>
                          <td>Disponible</td>
                          <td>
                            <Button
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
                <Button
                  onClick={handleBookAppointment}
                  className="mt-3"
                  variant="success"
                >
                  Confirmar
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Scheduler;