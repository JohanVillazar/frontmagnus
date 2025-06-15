import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CashProductConsumptionPanel = () => {
  const [variants, setVariants] = useState([]);
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/products", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error al obtener productos: ${res.status}`);
        }

        const data = await res.json();

        const mapped = data.map((item) => ({
          id: item.variantId,
          label:
            item.productVariant?.Product?.name +
            " - " +
            item.productVariant?.vatiantName,
        }));

        setVariants(mapped);
      } catch (err) {
        console.error("Error al cargar productos en caja:", err);
        toast({
          title: "Error al obtener productos",
          description: err.message,
          status: "error",
        });
      }
    };

    fetchVariants();
  }, []);

  const handleSubmit = async () => {
    if (!variantId || !quantity) {
      toast({
        title: "Campos requeridos",
        description: "Selecciona producto y cantidad",
        status: "warning",
      });
      return;
    }

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/internal-consum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          variantId,
          quantity: parseInt(quantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al registrar consumo");

      toast({ title: "Consumo registrado correctamente", status: "success" });
      setVariantId("");
      setQuantity("");
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      maxW="md"
      mx="auto"
      mt={6}
    >
      <Heading size="md" mb={4}>
        Registrar Consumo Interno
      </Heading>

      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Producto</FormLabel>
          <Select
            placeholder="Selecciona producto en caja"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Cantidad consumida</FormLabel>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="orange" onClick={handleSubmit}>
          Registrar consumo
        </Button>
      </VStack>
    </Box>
  );
};

export default CashProductConsumptionPanel;

  