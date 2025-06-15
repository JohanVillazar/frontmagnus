import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  useToast,
  Heading,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

const RegisterForm = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{1,10}$/;
    return regex.test(password);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validatePassword(formData.password)) {
    setPasswordError(
      'La contraseña debe tener máximo 10 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.'
    );
    return;
  }

  setPasswordError('');

  try {
    const res = await axios.post('https://backmagnus-production.up.railway.app/api/auth/register', formData);
    
    toast({
      title: 'Usuario registrado',
      description: res.data.msg,
      status: 'success',
      duration: 3000,
      isClosable: true
    });

    setFormData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    });

    // Redirigir al login tras breve espera
    setTimeout(() => {
      navigate('/');
    }, 1000);

  } catch (error) {
    toast({
      title: 'Error al registrar',
      description: error.response?.data?.msg || 'Ocurrió un error',
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  }
};


  return (
  <Box maxW="500px" mx="auto" p={6} boxShadow="md" borderRadius="md" bg="white">
    <Heading as="h2" size="lg" textAlign="center" mb={6} color="violet.400">
      Crea tu cuenta de Acceso
    </Heading>
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Apellido</FormLabel>
          <Input name="lastName" value={formData.lastName} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Teléfono</FormLabel>
          <Input name="phone" value={formData.phone} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Contraseña</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Button>
            </InputRightElement>
          </InputGroup>
          {passwordError && <Text color="red.500" fontSize="sm">{passwordError}</Text>}
        </FormControl>

        <Button type="submit" colorScheme="orange" size="lg" width="full">
          Registrarse
        </Button>
      </VStack>
    </form>
  </Box>
);

  
};

export default RegisterForm;
