import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    useToast,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const CreateUserForm = ({ onSuccess }) => {
    const [form, setForm] = useState({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
    });
  
    const toast = useToast();
  
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async () => {
      const { name, lastName, email, phone, password, role } = form;
  
      if (!name || !lastName || !email || !phone || !password || !role) {
        toast({ title: "Todos los campos son obligatorios", status: "warning" });
        return;
      }
  
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al crear usuario");
  
        toast({ title: "Usuario registrado correctamente", status: "success" });
        onSuccess?.();
        setForm({
          name: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "user",
        });
      } catch (err) {
        toast({ title: "Error", description: err.message, status: "error" });
      }
    };
  
    return (
      <Box maxW="md" mx="auto" bg="white" p={6} borderRadius="lg" boxShadow="md">
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
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Teléfono</FormLabel>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Rol</FormLabel>
            <Select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Cajero</option>
              <option value="admin">Administrador</option>
            </Select>
          </FormControl>
  
          <Button colorScheme="blue" w="full" onClick={handleSubmit}>
            Crear Usuario
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default CreateUserForm;
  