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
  
  const CreateSupplierForm = ({ onSuccess }) => {
    const [form, setForm] = useState({
      Nit: "",
      company: "",
      address: "",
      phone: "",
      email: "",
    });
  
    const toast = useToast();
  
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async () => {
      const { Nit, company, address, phone, email } = form;
      if (!Nit || !company || !address || !phone || !email) {
        toast({ title: "Todos los campos son obligatorios", status: "warning" });
        return;
      }
  
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/suppliers/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al registrar proveedor");
  
        toast({ title: "Proveedor registrado", status: "success" });
        onSuccess?.(); // Si se necesita refrescar lista
        setForm({ Nit: "", company: "", address: "", phone: "", email: "" });
      } catch (error) {
        toast({ title: "Error", description: error.message, status: "error" });
      }
    };
  
    return (
      <Box maxW="md" mx="auto" bg="white" p={6} borderRadius="lg" boxShadow="md">
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>NIT</FormLabel>
            <Input name="Nit" value={form.Nit} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Compañía</FormLabel>
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
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={form.email} onChange={handleChange} />
          </FormControl>
  
          <Button colorScheme="blue" w="full" onClick={handleSubmit}>
            Registrar Proveedor
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default CreateSupplierForm;
  