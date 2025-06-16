import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  IconButton,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const CashOpenForm = ({ onSuccess }) => {
  const [openingAmount, setOpeningAmount] = useState("");
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([{ variantId: "", quantity: "", autoLoaded: false }]);
  const toast = useToast();

  const userId = JSON.parse(localStorage.getItem("usuario"))?.id;

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/variant/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const flat = data.flatMap((product) =>
          product.variants.map((v) => ({
            ...v,
            label: `${product.name} - ${v.vatiantName}`,
            variantId: v.id || v.variantId,
          }))
        );
        setVariants(flat);
      } catch (error) {
        console.error("Error cargando variantes", error);
      }
    };

    const fetchPreviousFinalProducts = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/last-closed", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data) && data.length > 0) {
          const initialProducts = data.map((p) => ({
            variantId: p.variantId,
            quantity: String(p.finalQuantity),
            autoLoaded: true,
          }));
          setProducts(initialProducts);

          toast({
            title: "Productos del cierre anterior cargados",
            description: "",
            status: "info",
            duration: 4000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error cargando productos del cierre anterior:", error);
      }
    };

    fetchVariants();
    fetchPreviousFinalProducts();
  }, []);

  const handleAddProduct = () => {
    setProducts([...products, { variantId: "", quantity: "", autoLoaded: false }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    updated[index].autoLoaded = false; // Si edita, deja de ser precargado
    setProducts(updated);
  };

  const handleRemove = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleSubmit = async () => {
    if (!openingAmount || products.length === 0) {
      toast({ title: "Campos obligatorios", status: "warning" });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        userId,
        openingAmount: parseFloat(openingAmount),
        Products: products.map((p) => ({
          variantId: p.variantId,
          quantity: parseInt(p.quantity),
        })),
      };

      const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al abrir caja");

      localStorage.setItem("cashRegisterId", data.cashRegister?.id);
      toast({ title: "Caja abierta correctamente", status: "success" });

      onSuccess?.(data.cashRegister?.id);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" maxW="500px">
      <Heading size="md" mb={4}>Abrir Caja</Heading>

      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Monto de dinero inicial</FormLabel>
          <Input
            type="number"
            value={openingAmount}
            onChange={(e) => setOpeningAmount(e.target.value)}
          />
        </FormControl>

        {/* Contenedor scrollable */}
        <Box
          maxH={products.length > 8 ? "350px" : "auto"}
          overflowY={products.length > 8 ? "auto" : "visible"}
          pr={2}
        >
          {products.map((item, index) => (
            <VStack key={`${item.variantId}-${index}`} align="start" spacing={1} w="100%">
              <HStack
                spacing={2}
                w="100%"
                bg={item.autoLoaded ? "violet.70" : "transparent"}
                borderRadius="md"
                p={2}
              >
                <Select
                  placeholder="Productos Iniciales"
                  value={item.variantId}
                  onChange={(e) => handleChange(index, "variantId", e.target.value)}
                  isDisabled={item.autoLoaded}
                  bg="white"
                >
                  {variants.map((v) => (
                    <option key={v.variantId} value={v.variantId}>
                      {v.label}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Cantidad"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, "quantity", e.target.value)}
                  isDisabled={item.autoLoaded}
                  bg="white"
                />

                {!item.autoLoaded && (
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemove(index)}
                    aria-label="Eliminar"
                  />
                )}
              </HStack>

              {item.autoLoaded && (
                <Box fontSize="xs" color="black.500" pl={1}>
                  (Desde cierre anterior)
                </Box>
              )}
            </VStack>
          ))}
        </Box>

        <Button
          leftIcon={<AddIcon />}
          size="sm"
          variant="outline"
          onClick={handleAddProduct}
          alignSelf="flex-start"
        >
          Agregar más productos
        </Button>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Abrir caja
        </Button>
      </VStack>
    </Box>
  );
};

export default CashOpenForm;

  