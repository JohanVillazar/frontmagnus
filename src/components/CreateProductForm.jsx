import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  useToast,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useCategories } from "../hooks/useCategories";
import { useSuppliers } from "../hooks/useSuppliers";
import CategoryFormModal from "./CategoryFormModal";
import SupplierFormModal from "./SupplierFormModal";

const CreateProductForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const toast = useToast();

  const {
    isOpen: isCategoryModalOpen,
    onOpen: openCategoryModal,
    onClose: closeCategoryModal,
  } = useDisclosure();

  const {
    isOpen: isSupplierModalOpen,
    onOpen: openSupplierModal,
    onClose: closeSupplierModal,
  } = useDisclosure();

  const { categories, fetchCategories } = useCategories();
  const { suppliers, fetchSuppliers } = useSuppliers();

  const handleSubmit = async () => {
    if (!name || !description || !categoryId || !supplierId) {
      toast({
        title: "Campos requeridos",
        description: "Completa todos los campos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description,
          categoryId,
          supplierId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear producto");

      toast({
        title: "Producto creado",
        description: "Ahora puedes agregar variantes",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onSuccess(data.id);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      width="100%"
      maxW="500px"
      mx="auto"        // Centrado horizontal
      my={8}           // Espaciado vertical
    >
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Nombre del producto</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Guacamole porción"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Descripción</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Porción de guacamole 200gr"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Categoría</FormLabel>
          <HStack>
            <Select
              placeholder="Selecciona categoría"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <IconButton icon={<AddIcon />} onClick={openCategoryModal} />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Proveedor</FormLabel>
          <HStack>
            <Select
              placeholder="Selecciona proveedor"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.company} - {sup.Nit}
                </option>
              ))}
            </Select>
            <IconButton icon={<AddIcon />} onClick={openSupplierModal} />
          </HStack>
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit} width="full">
          Crear producto
        </Button>
      </VStack>

      {/* MODALES */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onCreated={(newCat) => {
          fetchCategories();
          setCategoryId(newCat.id);
        }}
      />

      <SupplierFormModal
        isOpen={isSupplierModalOpen}
        onClose={closeSupplierModal}
        onCreated={(newSupplier) => {
          fetchSuppliers();
          setSupplierId(newSupplier.id);
        }}
      />
    </Box>
  );
};

export default CreateProductForm;

