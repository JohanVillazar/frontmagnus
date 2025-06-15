import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const CreateTableModal = ({ isOpen, onClose, onTableCreated }) => {
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [seats, setSeats] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    if (!location || !number || !seats) {
      toast({ title: "Todos los campos son obligatorios", status: "warning" });
      return;
    }

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/table/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          number: parseInt(number),
          location,
          seats: parseInt(seats),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear la mesa");

      toast({ title: "Mesa creada exitosamente", status: "success" });
      onTableCreated?.(data); // Pass the new table data to the parent component
      onClose();
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Nueva Mesa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Número de Mesa</FormLabel>
              <Input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Ubicación</FormLabel>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cantidad de Asientos</FormLabel>
              <Input
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Crear Mesa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTableModal;
