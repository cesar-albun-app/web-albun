import React, { useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import { Form, Button, Table } from "react-bootstrap";
import "./UserPage.css";

// Función de Filtro Global (case-insensitive y por edad)
function globalFilter(rows, ids, filterValue) {
  const lowerCaseFilter = filterValue.toLowerCase(); // Convierte el texto a minúsculas
  return rows.filter((row) => {
    const { original } = row; // Datos de la fila
    return (
      original.firstName.toLowerCase().includes(lowerCaseFilter) ||
      original.lastName.toLowerCase().includes(lowerCaseFilter) ||
      original.age.toString().includes(filterValue) // Busca por edad también
    );
  });
}

// Componente de Filtro Global
const GlobalFilter = ({ filter, setFilter }) => (
  <Form.Control
    type="text"
    placeholder="Buscar por nombre, apellido o edad..."
    value={filter || ""}
    onChange={(e) => setFilter(e.target.value)}
    className="mb-4"
  />
);

const PatientTable = ({ patients, handleEditPatient, handleDeletePatient, handleViewDetails }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Imagen",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={value}
            alt="Paciente"
            className="patient-image"
          />
        ),
      },
      {
        Header: "Nombre",
        accessor: "firstName",
        Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        Header: "Edad",
        accessor: "age",
      },
      {
        Header: "Teléfono",
        accessor: "phone",
      },
      {
        Header: "Correo",
        accessor: "email",
      },
     
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <div className="action-buttonss">
            <Button
              variant="info"
              size="sm"
              className="me-2"
              onClick={() => handleEditPatient(row.original)}
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="me-2"
              onClick={() => handleDeletePatient(row.original.id)}
            >
              Eliminar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleViewDetails(row.original)}
            >
              Detalles
            </Button>
          </div>
        ),
      },
    ],
    [handleEditPatient, handleDeletePatient, handleViewDetails]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: patients,
      globalFilter, // Asigna la función de filtro personalizada
    },
    useGlobalFilter, // Habilita filtros globales
    useSortBy // Habilita ordenamiento
  );

  const { globalFilter: filterValue } = state;

  return (
    <div className="patient-table-container">
      <GlobalFilter filter={filterValue} setFilter={setGlobalFilter} />
      <Table striped bordered hover responsive {...getTableProps()} className="patient-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No hay registros para los parámetros buscados.
              </td>
            </tr>
          )}
        </tbody>
      </Table> 
    </div>
  );
};

export default PatientTable;