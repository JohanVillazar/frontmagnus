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
  
  const SupplierFormModal = ({ isOpen, onClose, onCreated }) => {
    const [form, setForm] = useState({
      Nit: "",
      company: "",
      address: "",
      phone: "",
      email: "",
    });
  
    const toast = useToast();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleCreate = async () => {
      const { Nit, company, address, phone, email } = form;
  
      if (!Nit || !company || !address || !phone || !email) {
        toast({
          title: "Campos requeridos",
          description: "Completa todos los campos",
          status: "warning",
        });
        return;
      }
  
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al crear proveedor");
  
        toast({
          title: "Proveedor creado",
          status: "success",
        });
  
        setForm({
          Nit: "",
          company: "",
          address: "",
          phone: "",
          email: "",
        });
  
        onCreated(data); // pasa el objeto creado
        onClose();
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
          <ModalHeader>Crear nuevo proveedor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>NIT</FormLabel>
                <Input name="Nit" value={form.Nit} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Empresa</FormLabel>
                <Input name="company" value={form.company} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Dirección</FormLabel>
                <Input name="address" value={form.address} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Teléfono</FormLabel>
                <Input name="phone" value={form.phone} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Correo electrónico</FormLabel>
                <Input name="email" type="email" value={form.email} onChange={handleChange} />
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
  
  export default SupplierFormModal;
  