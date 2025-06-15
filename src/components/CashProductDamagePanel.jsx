import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    VStack,
    useToast,
    Heading,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  
  const CashProductDamagePanel = () => {
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
          const data = await res.json();
  
          const mapped = data.map((item) => ({
            id: item.variantId,
           label: `${item.productVariant?.Product?.name} - ${item.productVariant?.vatiantName}`
          }));
  
          setVariants(mapped);
        } catch (err) {
          console.error("Error al cargar productos en caja:", err);
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
        const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/product-damage", {
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
        if (!res.ok) throw new Error(data.msg || "Error al registrar daño");
  
        toast({ title: "Daño registrado correctamente", status: "success" });
        setVariantId("");
        setQuantity("");
      } catch (err) {
        toast({ title: "Error", description: err.message, status: "error" });
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
      <Heading size="md" mb={4}>Porducto Dañado</Heading>

         <VStack spacing={3} align="stretch" flex="1">
           <FormControl isRequired>
             <FormLabel fontSize="sm">Producto</FormLabel>
             <Select
               placeholder="Selecciona un producto"
               size="sm"
               value={variantId}
               onChange={(e) => setVariantId(e.target.value)}
             >
               {variants.map((v, index) => (
                 <option key={`${v.id}-${index}`} value={v.id}>
                   {v.label}
                 </option>
               ))}
             </Select>

           </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm">Cantidad</FormLabel>
          <Input
            type="number"
            size="sm"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ej. 5"
          />
        </FormControl>

        <Button
          colorScheme="red"
          size="sm"
          mt={2}
          onClick={handleSubmit}
        >
          Registrar Daño
        </Button>
      </VStack>
    </Box>
  );
};
  
  export default CashProductDamagePanel;
  