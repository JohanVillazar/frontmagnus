// src/components/Clientes/CreateCustomerForm.jsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const CreateCustomerForm = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    dni: "",
    address: "",
    city: "",
    phone: "",
  });

  const toast = useToast();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // si usas middleware auth
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Error al registrar cliente");

      toast({
        title: "Cliente creado",
        description: data.msg,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setForm({
        name: "",
        lastName: "",
        dni: "",
        address: "",
        city: "",
        phone: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Apellido</FormLabel>
            <Input name="lastName" value={form.lastName} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>DNI</FormLabel>
            <Input name="dni" value={form.dni} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Dirección</FormLabel>
            <Input name="address" value={form.address} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Ciudad</FormLabel>
            <Input name="city" value={form.city} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </FormControl>

          <Button colorScheme="purple" type="submit" width="full">
            Crear Cliente
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateCustomerForm;
