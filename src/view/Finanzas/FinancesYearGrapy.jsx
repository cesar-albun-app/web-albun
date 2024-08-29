import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Card, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FinancesYearGraphy() {
  const allMonths = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const allData = [12000, 15000, 8000, 14000, 20000, 25000, 22000, 30000, 28000, 32000, 31000, 34000];
  
  const pieDataForMonths = {
    'Enero': [500, 300, 100, 200, 150],
    'Febrero': [600, 400, 200, 150, 250],
    'Marzo': [700, 350, 120, 240, 130],
    'Todos': [6000, 4500, 1800, 2000, 1800]
  };

  const [selectedMonth, setSelectedMonth] = useState('Todos');
  
  const filteredLabels = selectedMonth === 'Todos' ? allMonths : [selectedMonth];
  const filteredData = selectedMonth === 'Todos' ? allData : [allData[allMonths.indexOf(selectedMonth)]];
  
  const monthlyData = {
    labels: filteredLabels,
    datasets: [
      {
        label: 'Ingresos Mensuales',
        data: filteredData,
        fill: false,
        borderColor: '#4bc0c0',
        backgroundColor: '#4bc0c0',
        tension: 0.1,
      },
    ],
  };

  const pieData = {
    labels: ['Gastos de Alquiler', 'Gastos de Comida', 'Transporte', 'Entretenimiento', 'Otros'],
    datasets: [
      {
        label: 'Gastos',
        data: pieDataForMonths[selectedMonth],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#ff9f40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#ff9f40'],
      },
    ],
  };

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col md={8} className="text-center">
          <DropdownButton
            id="dropdown-basic-button"
            title={`Mes seleccionado: ${selectedMonth}`}
            onSelect={handleSelectMonth}
            variant="info"
            style={{
              fontFamily: 'Comic Sans MS, cursive',
              fontSize: '1.2rem',
            }}
          >
            <Dropdown.Item eventKey="Todos">Todos</Dropdown.Item>
            {allMonths.map((month) => (
              <Dropdown.Item key={month} eventKey={month}>
                {month}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>
      <Row>
        <Col md={8} className="mb-4">
          <Card
            style={{
              backgroundColor: '#ff6f61',
              color: '#fff',
              borderRadius: '15px',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem', fontFamily: 'Comic Sans MS, cursive' }}>
                Ingresos Mensuales
              </Card.Title>
              <Line data={monthlyData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card
            style={{
              backgroundColor: '#4bc0c0',
              color: '#fff',
              borderRadius: '15px',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontSize: '2rem', fontFamily: 'Comic Sans MS, cursive' }}>
                Distribución de Gastos
              </Card.Title>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}