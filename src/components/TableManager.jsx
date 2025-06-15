import React, { useState } from "react";
import CreateTableModal from "./CreateTableModal";

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTableCreated = (newTable) => {
    setTables((prevTables) => [...prevTables, newTable]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>Lista de Mesas</h1>
      <ul>
        {tables.map((table) => (
          <li key={table.id}>
            {`Table Number: ${table.number}, Location: ${table.location}, Seats: ${table.seats}`}
          </li>
        ))}
      </ul>
      <button onClick={openModal}>Agregar Nueva Mesa</button>
      <CreateTableModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onTableCreated={handleTableCreated}
      />
    </div>
  );
};

export default TableManager;