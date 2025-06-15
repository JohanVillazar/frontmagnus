import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    VStack,
    useToast,
    Heading,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { fetchWithAuth } from '../api/api';
  
  const CashExpensePanel = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const toast = useToast();
  
    const handleSubmit = async () => {
      if (!amount || isNaN(amount)) {
        toast({
          title: "Monto inválido",
          description: "Ingresa un valor válido para el gasto",
          status: "warning",
        });
        return;
      }

        try {
        // 1. Usamos fetchWithAuth en lugar de fetch manual
        const res = await fetchWithAuth("/cash/add-bills", {
            method: "POST",
            body: JSON.stringify({
                amount: parseFloat(amount),
                description,
            }),
        });

        const data = await res.json();

        // 2. Si hay errores (ej: 400, 500), lanzamos un error
        if (!res.ok) throw new Error(data.msg || "Error al registrar gasto");

        // 3. Notificación de éxito
        toast({
            title: "Gasto registrado",
            description: `-$${amount} registrado correctamente`,
            status: "success",
        });

        // 4. Limpiar el formulario
        setAmount("");
        setDescription("");
    } catch (err) {
        // 5. Manejo de errores (incluye 401 automáticamente por fetchWithAuth)
        toast({
            title: "Error",
            description: err.message,
            status: "error",
        });
    }
};
  
  
  
return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="sm"
      p={5}
      bg="white"
      minH="320px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Heading size="md" mb={4}>
        Sueldos/Gastos
      </Heading>

      <VStack spacing={3} align="stretch" flex="1">
        <FormControl isRequired>
          <FormLabel fontSize="sm">Monto</FormLabel>
          <Input
            type="number"
            size="sm"
            placeholder="Ej. 250.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">Concepto</FormLabel>
          <Textarea
            size="sm"
            placeholder="Ej.Sueldo Pedro"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="red"
          size="sm"
          mt={2}
          onClick={handleSubmit}
        >
          Registrar gasto
        </Button>
      </VStack>
    </Box>
  );
};

  
  export default CashExpensePanel;
  