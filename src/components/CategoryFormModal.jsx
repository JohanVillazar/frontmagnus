import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    VStack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  
  const CategoryFormModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Nombre requerido",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://backmagnus-production.up.railway.app/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, logo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear categoría");

      toast({
        title: "Categoría creada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setName("");
      setLogo("");
      setDescription("");

      // ✅ Llamamos el callback solo si existe
      if (typeof onCategoryCreated === "function") {
        onCategoryCreated(data);
      }

      onClose(); // cerrar modal
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear nueva categoría</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Logo</FormLabel>
              <Input value={logo} onChange={(e) => setLogo(e.target.value)} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreate} colorScheme="blue" mr={3}>
            Crear
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryFormModal;