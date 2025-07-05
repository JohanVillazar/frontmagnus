import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Text, useToast, HStack, Divider, Heading, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSuppliers } from "../hooks/useSuppliers";

const CreatePurchase = () => {
  const [variants, setVariants] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursalId, setSelectedSucursalId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState('pendiente'); // 🆕 Estado del status
  const toast = useToast();
  const [supplierId, setSupplierId] = useState("");
  const suppliers = useSuppliers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [variantsRes, sucursalesRes] = await Promise.all([
          fetch("https://backmagnus-production.up.railway.app/api/variant/all", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}),
          fetch("https://backmagnus-production.up.railway.app/api/sucursal/all", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
        ]);

        const variantsData = await variantsRes.json();
        const sucursalesData = await sucursalesRes.json();

        if (variantsRes.ok) {
          setVariants(variantsData.flatMap(prod => prod.variants.map(v => ({
            ...v,
            productName: prod.name,
          }))));
        }
        if (sucursalesRes.ok) {
          setSucursales(sucursalesData);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
  }, []);

  const handleAddDetail = () => {
    const variant = variants.find(v => v.id === selectedVariantId);
    if (!variant) return;

    const detail = {
      productVariantId: variant.id,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      productName: variant.productName,
      variantName: variant.vatiantName,
    };

    setPurchaseDetails(prev => [...prev, detail]);
    setTotalAmount(prev => prev + (detail.quantity * detail.unitPrice));
    setSelectedVariantId("");
    setQuantity(1);
    setUnitPrice(0);
  };

  const handleSubmitPurchase = async () => {
    if (!selectedSucursalId) {
      toast({ title: "Debes seleccionar una sucursal", status: "warning" });
      return;
    }

    if (purchaseDetails.length === 0) {
      toast({ title: "Agrega al menos un producto", status: "warning" });
      return;
    }

    const payload = {
      SucursalId: selectedSucursalId,
      userId: JSON.parse(localStorage.getItem("user"))?.id,
      totalAmount,
      status, // 🆕 enviamos status
      details: purchaseDetails.map(d => ({
        productVariantId: d.productVariantId,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
      })),
    };

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/purchase/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al registrar compra");

      toast({ title: "Compra registrada exitosamente", status: "success" });
      setPurchaseDetails([]);
      setTotalAmount(0);
      setSelectedSucursalId("");
      setStatus("pendiente");
    } catch (err) {
      console.error("Error al registrar compra:", err);
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <Flex ml={{ base: 0, md: "20px" }} p={6} justify="center" align="start" minH="100vh">
      <Box bg="white" p={6} rounded="lg" shadow="md" w="full" maxW="lg">
        <Heading size="lg" mb={6} textAlign="center">
          Registrar Nueva Compra
        </Heading>

        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Sucursal</FormLabel>
            <Select
              placeholder="Selecciona una sucursal"
              value={selectedSucursalId}
              onChange={(e) => setSelectedSucursalId(e.target.value)}
            >
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Proveedor</FormLabel>
            <Select
              placeholder="Selecciona un proveedor"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </FormControl>

          
          

          <FormControl isRequired>
            <FormLabel>Estado de la compra</FormLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Producto</FormLabel>
            <Select
              placeholder="Selecciona un producto"
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.productName} - {v.vatiantName}
                </option>
              ))}
            </Select>
          </FormControl>

          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Cantidad</FormLabel>
              <Input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Precio Unitario</FormLabel>
              <Input
                type="number"
                value={unitPrice}
                min={0}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </FormControl>
          </HStack>

          <Button colorScheme="blue" onClick={handleAddDetail}>
            Agregar producto
          </Button>

          <Divider />

          <Box>
            <Text fontWeight="bold" mb={2}>Productos agregados:</Text>
            {purchaseDetails.length === 0 ? (
              <Text color="gray.500">No has agregado productos aún</Text>
            ) : (
              purchaseDetails.map((d, idx) => (
                <Box key={idx} mb={2}>
                  <Text>{d.productName} - {d.variantName} | {d.quantity} u. x ${d.unitPrice} = ${d.quantity * d.unitPrice}</Text>
                </Box>
              ))
            )}
          </Box>

          <Text fontSize="lg" fontWeight="bold" textAlign="right">
            Total: ${totalAmount.toLocaleString()}
          </Text>

          <Button colorScheme="green" onClick={handleSubmitPurchase}>
            Registrar Compra
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default CreatePurchase;


