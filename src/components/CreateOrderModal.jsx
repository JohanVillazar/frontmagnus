import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  VStack,
  useToast,
  Badge
} from "@chakra-ui/react";

const CreateOrderModal = ({ isOpen, onClose, table, onOrderSuccess }) => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
    const toast = useToast();

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/combo/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        const transformed = data.map((combo) => ({
          variantId: combo.id,
          productName: combo.name,
          variantName: "Combo",
          priceperUnit: parseFloat(combo.price),
        }));

        setProducts(transformed);
      } catch (err) {
        console.error("Error cargando combos:", err);
      }
    };

    if (isOpen) {
      fetchCombos();
      setOrderItems([]);
          }
  }, [isOpen]);

  const handleAddCombo = (combo) => {
    const exists = orderItems.find((item) => item.variantId === combo.variantId);
    if (exists) {
      setOrderItems(orderItems.map((item) =>
        item.variantId === combo.variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        variantId: combo.variantId,
        productName: combo.productName,
        variantName: combo.variantName,
        price: combo.priceperUnit,
        quantity: 1
      }]);
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

const handleSubmit = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const cashRegisterId = localStorage.getItem("cashRegisterId");

  if (!cashRegisterId) {
    toast({
      title: "Error",
      description: "No hay caja abierta. Por favor, abre una caja antes de registrar un pedido.",
      status: "error",
    });
    return;
  }

  try {
    const res = await fetch("https://backmagnus-production.up.railway.app/api/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        tableId: table.id,
        userId,
        cashRegisterId,
        products: orderItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Falta un ingrediente en la receta o inventario");

    toast({ title: "Pedido creado exitosamente", status: "success" });
    onOrderSuccess?.();
  } catch (err) {
    toast({ title: "Error", description: err.message, status: "error" });
  }
};


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent maxW={{ base: "100%", md: "5xl" }} p={{ base: 4, md: 8}}>
        <ModalHeader>Crear Pedido - Mesa {table?.number}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
            {/* Resumen Pedido */}
            <Box>
              <Text fontWeight="bold" mb={3}>Productos Agregados:</Text>
              {orderItems.length === 0 ? (
                <Text color="gray.500">No hay productos aún</Text>
              ) : (
                <VStack align="start" spacing={2}>
                  {orderItems.map((item, idx) => (
                    <Text key={idx}>
                      {item.variantName} - {item.productName} x {item.quantity} = $
                      {(item.price * item.quantity).toLocaleString()}
                    </Text>
                  ))}
                </VStack>
              )}
              <Box mt={6}>
                <Text><strong>Subtotal:</strong> ${subtotal.toLocaleString()}</Text>
                <Box borderTop="1px solid #e2e8f0" mt={4} pt={4}>
                <Text><strong>Costos de envío:</strong> $0</Text>
                <Text fontSize="lg" mt={2}><strong>TOTAL:</strong> ${total.toLocaleString()}</Text>
                </Box>
              </Box>
              <Button mt={4} colorScheme="green" onClick={handleSubmit}>
                Agregar Pedido a Mesa
              </Button>
            </Box>

            {/* Combos Disponibles */}
            <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={2}>
              {products.map((combo) => (
                <Box
                  key={combo.variantId}
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: "gray.200" }}
                  onClick={() => handleAddCombo(combo)}
                >
                  <Text fontWeight="bold">{combo.productName}</Text>
                  <Badge colorScheme="blue" mt={2}>${combo.priceperUnit.toLocaleString()}</Badge>
                  <Text fontSize="sm" color="gray.600"></Text>
                </Box>
              ))}
            </Grid>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrderModal;





  