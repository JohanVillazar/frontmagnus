import { useEffect, useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  // Obtener todas las categorías
  const fetchCategories = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/category/all", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Crear una nueva categoría
  const createCategory = async (categoryData) => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear categoría");
      await fetchCategories(); // actualiza la lista después de crear
      return data;
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    fetchCategories,
    createCategory,
  };
};