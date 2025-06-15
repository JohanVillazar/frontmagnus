import { useEffect, useState } from "react";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  // Obtener lista de proveedores
  const fetchSuppliers = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/suppliers/all", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };
  

  // Crear un nuevo proveedor
  const createSupplier = async (supplierData) => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/suppliers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear proveedor");
      await fetchSuppliers(); // refrescar la lista
      return data;
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    fetchSuppliers,
    createSupplier,
  };
};

