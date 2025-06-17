import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading
} from "@chakra-ui/react";
import { useState } from "react";

const CreateSucursalForm = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    manager: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/sucursal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Error al crear la sucursal");

      toast({
        title: "Sucursal creada",
        description: data.msg,
        status: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        manager: "",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
      });
    }
  };

  return (
    <Box p={4} maxW="600px" mx="auto">
      <Heading size="lg" mb={6} textAlign="center">
        Crear Sucursales
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Correo</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Dirección</FormLabel>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Ciudad</FormLabel>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Encargado</FormLabel>
            <Input name="manager" value={formData.manager} onChange={handleChange} />
          </FormControl>

          <Button type="submit" colorScheme="purple" width="full">
            Crear Sucursal
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateSucursalForm;
