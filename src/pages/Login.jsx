import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  Checkbox,
  useToast,
  Heading,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Credenciales incorrectas");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({ title: "Inicio de sesión exitoso", status: "success" });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  return (
    <Flex h="100vh" flexDirection={{ base: "column", md: "row" }}>
      {/* FORMULARIO */}
      <Box flex={1} p={10} display="flex" alignItems="center" justifyContent="center">
        <Box w="full" maxW="md">
          <Heading mb={6}>Bienvenido de nuevo</Heading>
          <Text mb={6}>Ingresa tus credenciales para acceder al sistema</Text>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Flex justify="space-between" align="center">
              <Checkbox>Recordarme</Checkbox>
              <Link as={RouterLink} to="/register" color="orange.500">
                Registrarse
              </Link>
            </Flex>
            <Button colorScheme="orange" onClick={handleLogin}>
              Iniciar sesión
            </Button>
          </Stack>
        
        </Box>
      </Box>

      {/* BRANDING CON IMAGEN */}
      <Box
        flex={1}
        bg="white"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        p={1}
        
        borderX={"1px solid"}
        borderColor=" #f77700"
      >
        <VStack spacing={4}>
          <Image
            src="/magnus.png" 
            alt="Magnus POS"
            maxW="800px"
            objectFit="contain"
          />
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;


