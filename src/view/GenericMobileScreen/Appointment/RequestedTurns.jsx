import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Table, Spinner, Button, Modal, Form } from "react-bootstrap";
import "./SchedulerTable.css"; 

const RequestedTurns = ({domain})  => {
  const [requestedTurns, setRequestedTurns] = useState([]);
  const [filteredTurns, setFilteredTurns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customPhone, setCustomPhone] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`;
  };

  useEffect(() => {
    const fetchRequestedTurns = async () => {
      setLoading(true);
      try {
         const querySnapshot = await getDocs(collection(db, `applicationsBase/schedulers/${domain}`));
   

        const turns = [];
        querySnapshot.docs.forEach((doc) => {
          const { slots = [] } = doc.data();
          slots.forEach((slot) => {
            if (slot.user) {
              turns.push({
                id: doc.id,
                time: slot.time,
                date: slot.date,
                user: slot.user,
                status: slot.status || "pending", // "pending", "taken", "notTaken"
              });
            }
          });
        });

        setRequestedTurns(turns);
        setFilteredTurns(turns);
      } catch (error) {
        console.error("Error al cargar los turnos solicitados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedTurns();
  }, []);

  // Actualiza los turnos filtrados al cambiar el filtro
  useEffect(() => {
    let filtered = [...requestedTurns];

    if (filterStatus !== "all") {
      filtered = filtered.filter((turn) => turn.status === filterStatus);
    }

    if (filterMonth !== "all") {
      filtered = filtered.filter((turn) => {
        const [year, month] = turn.id.split("-");
        return parseInt(month, 10) === parseInt(filterMonth, 10);
      });
    }

    setFilteredTurns(filtered);
  }, [filterStatus, filterMonth, requestedTurns]);

  const sendWhatsApp = (phone, message) => {
    if (!phone) {
      alert("El usuario no tiene un número de teléfono asociado.");
      return;
    }
    const url = `https://wa.me/549${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleSendWhatsApp = (turn) => {
    const message = `Hola ${turn.user.name}, su turno reservado para el ${turn.date} a las ${turn.time} sigue en pie. Si tiene alguna consulta, contáctenos.`;
    sendWhatsApp(turn.user.phone, message);
  };

  const handleManualWhatsApp = () => {
    if (customMessage && customPhone) {
      sendWhatsApp(customPhone, customMessage);
      setShowModal(false);
      setCustomPhone("");
      setCustomMessage("");
    } else {
      alert("Debe ingresar un mensaje y un número de teléfono válido.");
    }
  };

  const handleStatusChange = async (turn, newStatus) => {
    try {
      const updatedTurns = requestedTurns.map((t) =>
        t.id === turn.id && t.time === turn.time
          ? { ...t, status: newStatus }
          : t
      );
      setRequestedTurns(updatedTurns);
      const docRef = doc(db, `applicationsBase/schedulers/${domain}`, turn.id);
      const slots = (await (await getDocs(docRef)).data()).slots.map((slot) =>
        slot.time === turn.time ? { ...slot, status: newStatus } : slot
      );
      await updateDoc(docRef, { slots });
    } catch (error) {
      console.error("Error al actualizar el estado del turno:", error);
    }
  };

  const getRowClassName = (status) => {
    if (status === "taken") return "table-success";
    if (status === "notTaken") return "table-danger";
    return "table-warning";
  };

  return (
    <div className="requested-turns">
      <h5>Turnos Solicitados</h5>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          {/* Filtro por Estado */}
          <Form.Group className="mb-2 small-select">
            <Form.Label>Filtrar por Estado</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="taken">Asistió</option>
              <option value="notTaken">No Asistió</option>
            </Form.Select>
          </Form.Group>

          {/* Filtro por Mes */}
          <Form.Group className="mb-2 small-select">
          <Form.Label>Filtrar por Mes</Form.Label>
              <Form.Select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </Form.Select>
            </Form.Group>

          {filteredTurns.length > 0 ? (
         <Table bordered hover responsive className="modern-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTurns.map((turn, index) => (
                  <tr key={index} className={getRowClassName(turn.status)}>
                    <td>{formatDate(turn.id)}</td>
                    <td>{turn.time}</td>
                    <td>{turn.user.name}</td>
                    <td>{turn.user.email}</td>
                    <td>{turn.user.phone || "N/A"}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={turn.status}
                        onChange={(e) => handleStatusChange(turn, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="taken">Asistió</option>
                        <option value="notTaken">No Asistió</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleSendWhatsApp(turn)}
                      >
                        Enviar WhatsApp
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No hay turnos para la selección actual.</p>
          )}

          <Button
            className="mt-3"
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Enviar WhatsApp Manual
          </Button>
        </>
      )}

      {/* Modal para enviar WhatsApp manual */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enviar WhatsApp Manual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPhone">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el número (sin + ni 549)"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMessage" className="mt-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese el mensaje"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleManualWhatsApp}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RequestedTurns;