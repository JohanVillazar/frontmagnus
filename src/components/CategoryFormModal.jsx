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
  
  const CategoryFormModal = ({ isOpen, onClose, onCreated }) => {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const [description, setDescription] = useState("");
    const toast = useToast();
  
    const handleCreate = async () => {
      if (!name.trim()) {
        toast({
          title: "Nombre requerido",
          status: "warning",
        });
        return;
      }
  
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://backmagnus-production.up.railway.app/api/category/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name, logo }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al crear categoría");
  
        toast({
          title: "Categoría creada",
          status: "success",
        });
  
        setName("");
        setLogo("");
        setDescription("");
        onCreated(data); // pasa el objeto creado
        onClose(); // cierra el modal
      } catch (err) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
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
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
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
  