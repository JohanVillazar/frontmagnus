import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Select,
    useToast,
    FormControl,
    FormLabel,
    VStack
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  
  const ReserveTableModal = ({ isOpen, onClose, onSuccess }) => {
    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState("");
    const toast = useToast();
  
    const fetchAvailableTables = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://backmagnus-production.up.railway.app/api/table/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          // 🔥 Aquí corregimos: usamos data.tables
          const mesas = Array.isArray(data) ? data : (data.tables || []);
          const available = mesas.filter(t => t.status === "disponible");
          setTables(available);
    
          // (Opcional PRO) Si quieres seleccionar automáticamente la primera mesa:
          if (available.length > 0) {
            setSelectedTableId(available[0].id);
          }
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error al cargar mesas",
          description: "No se pudieron cargar las mesas disponibles",
          status: "error",
        });
      }
    };
    
  
    const handleReserve = async () => {
      if (!selectedTableId) {
        toast({ title: "Selecciona una mesa para reservar", status: "warning" });
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://backmagnus-production.up.railway.app/api/table/${selectedTableId}/reserve`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        });
  
        const data = await res.json();
        if (res.ok) {
          toast({ title: "Mesa reservada exitosamente", status: "success" });
          onClose();
          onSuccess(); // 🔥 Refrescamos listado
        } else {
          toast({ title: "Error", description: data.msg, status: "error" });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "No se pudo reservar la mesa",
          status: "error",
        });
      }
    };
  
    useEffect(() => {
      if (isOpen) {
        fetchAvailableTables();
      }
    }, [isOpen]);
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reservar Mesa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Selecciona una mesa disponible</FormLabel>
                <Select
                  placeholder="Selecciona una mesa"
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                >
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Mesa {table.number} - {table.location} ({table.seats} asientos)
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleReserve}>
              Reservar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ReserveTableModal;
  