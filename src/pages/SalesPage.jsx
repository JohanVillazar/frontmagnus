import {
  Box,
  Grid,
  Heading,
  VStack,
  Text,
  Divider,
  Flex,
  Button,
  Input,
  Select,
  HStack,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";

const SalesPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [discountType, setDiscountType] = useState("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [cashRegisterId, setCashRegisterId] = useState("");
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");

  const toast = useToast();

  useEffect(() => {
    const id = localStorage.getItem("cashRegisterId");
    if (id) setCashRegisterId(id);
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const taxAmount = (subtotal * tax) / 100;

    let discountAmount = 0;
    if (discountType === "fixed") {
      discountAmount = discountValue;
    } else {
      discountAmount = (subtotal * discountValue) / 100;
    }

    const total = subtotal + taxAmount + Number(shipping) - discountAmount;

    return { subtotal, taxAmount, discountAmount, total };
  };

  const { total } = calculateTotals();
  const change = parseFloat(amountReceived || 0) - total;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const cashRegisterId = localStorage.getItem("cashRegisterId");
    const token = localStorage.getItem("token");

    try {
      const payload = {
        userId,
        cashRegisterId,
        customerId: "0fa184c9-af51-4565-9f68-d3c320062215", //cliente default
        paymentMethod: paymentMethod || "efectivo",
        shippingCost: parseFloat(shipping),
        details: cartItems.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      const res = await fetch("https://backmagnus-production.up.railway.app/api/sale/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar venta");

      toast({
        title: "Venta registrada",
        description: `Factura: ${data.sale.reference} — Total: $${data.sale.totalPrice}`,
        status: "success",
      });

      setCartItems([]);
      setShowPaymentFields(false);
      setAmountReceived("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
      });
    }
  };

  return (
    <Box ml="250px" p={6}>
      <Heading size="lg" mb={4}>
        Punto de Venta
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
        {/* 🛒 Panel Izquierdo - Carrito */}
        <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>
            Productos en carrito
          </Heading>

          {cartItems.length === 0 ? (
            <Text color="gray.500">Aún no hay productos</Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {cartItems.map((item) => (
                <Flex key={item.id} justify="space-between">
                  <Text>{item.name}</Text>
                  <Text>x{item.quantity}</Text>
                </Flex>
              ))}
            </VStack>
          )}

          <Divider my={4} />

          <VStack spacing={2} align="stretch">
            <Flex justify="space-between">
              <Text fontSize="sm">Subtotal:</Text>
              <Text fontSize="sm">${calculateTotals().subtotal.toFixed(2)}</Text>
            </Flex>

            <Flex justify="space-between" align="center">
              <Text fontSize="sm">Impuesto (%)</Text>
              <Input
                type="number"
                size="sm"
                w="80px"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </Flex>

            <Flex justify="space-between" align="center">
              <Text fontSize="sm">Descuento</Text>
              <HStack>
                <Select
                  size="sm"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="fixed">Fijo</option>
                  <option value="percent">%</option>
                </Select>
                <Input
                  type="number"
                  size="sm"
                  w="80px"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
              </HStack>
            </Flex>

            <Flex justify="space-between" align="center">
              <Text fontSize="sm">Envío</Text>
              <Input
                type="number"
                size="sm"
                w="80px"
                value={shipping}
                onChange={(e) => setShipping(Number(e.target.value))}
              />
            </Flex>

            <Divider />

            <Flex justify="space-between" fontWeight="bold">
              <Text>Total:</Text>
              <Text>${calculateTotals().total.toFixed(2)}</Text>
            </Flex>
          </VStack>

          <Divider my={4} />

          {!showPaymentFields ? (
            <Flex justify="space-between" gap={2}>
              <Button colorScheme="yellow" variant="outline" w="full">
                Mantener
              </Button>
              <Button colorScheme="red" variant="outline" w="full" onClick={() => setCartItems([])}>
                Reiniciar
              </Button>
              <FormControl>
                <FormLabel>Método de pago</FormLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="nequi">Nequi</option>
                </Select>
              </FormControl>
              <Button colorScheme="green" w="full" onClick={() => setShowPaymentFields(true)}>
                Pagar ahora
              </Button>
            </Flex>
          ) : (
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>Resumen de Pago</Text>

              <Flex justify="space-between" mb={2}>
                <Text>Total a pagar:</Text>
                <Text>${total.toFixed(2)}</Text>
              </Flex>

              <Input
                placeholder="Monto recibido"
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                mb={2}
              />

              <Flex justify="space-between" mb={4}>
                <Text>Cambio:</Text>
                <Text fontWeight="bold" color={change < 0 ? "red.500" : "green.500"}>
                  ${isNaN(change) ? "0.00" : change.toFixed(2)}
                </Text>
              </Flex>

              <Flex gap={2}>
                <Button w="full" variant="ghost" onClick={() => setShowPaymentFields(false)}>
                  Cancelar
                </Button>
                <Button
                  w="full"
                  colorScheme="blue"
                  isDisabled={change < 0}
                  onClick={handleCheckout}
                >
                  Confirmar y Finalizar Venta
                </Button>
              </Flex>
            </Box>
          )}
        </Box>

        {/* 🧃 Grid Derecho - Productos */}
        <Box>
          <Heading size="md" mb={4}>
            Productos
          </Heading>

          <ProductCatalog onSelectProduct={handleAddToCart} />
        </Box>
      </Grid>
    </Box>
  );
};

export default SalesPage;


  