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
  
  const CashIncomePanel = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const toast = useToast();
  
    const handleSubmit = async () => {
      if (!amount || isNaN(amount)) {
        toast({
          title: "Monto inválido",
          description: "Ingresa un valor válido para el ingreso",
          status: "warning",
        });
        return;
      }
  
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/add-income", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            description,
          }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al registrar ingreso");
  
        toast({
          title: "Ingreso registrado",
          description: `+$${amount} registrado correctamente`,
          status: "success",
        });
  
        setAmount("");
        setDescription("");
      } catch (err) {
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
        Registrar Ingreso
      </Heading>

      <VStack spacing={3} align="stretch" flex="1">
        <FormControl isRequired>
          <FormLabel fontSize="sm">Monto</FormLabel>
          <Input
            type="number"
            size="sm"
            placeholder="Ej. 100.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">Concepto</FormLabel>
          <Textarea
            size="sm"
            placeholder="Ej. Cuenta por Cobrar"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="green"
          size="sm"
          mt={2}
          onClick={handleSubmit}
        >
          Registrar ingreso
        </Button>
      </VStack>
    </Box>
  );
};
  
  export default CashIncomePanel;
  