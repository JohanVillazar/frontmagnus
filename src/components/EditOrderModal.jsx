import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Input,
  Button,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const EditOrderModal = ({ isOpen, onClose, table }) => {
  const [products, setProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const toast = useToast();
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");

  useEffect(() => {
    if (paymentMethod === "nequi" || paymentMethod === "tarjeta") {
      setAmountReceived(total.toString());
    }
  }, [paymentMethod, total]);

  useEffect(() => {
    if (table) {
      fetchProducts();
      fetchActiveOrder();
    }
  }, [table]);

  const fetchProducts = async () => {
    const res = await fetch("https://backmagnus-production.up.railway.app/api/variant/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();

    const flat = data.flatMap((product) =>
      product.variants.map((v) => ({
        ...v,
        label: `${v.vatiantName} - ${product.name}`,
        variantId: v.id,
      }))
    );
    setProducts(flat);
  };

  const fetchActiveOrder = async () => {
    try {
      const res = await fetch(`https://backmagnus-production.up.railway.app/api/order/table/${table.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrderDetails(data.order.details);
        setTotal(parseFloat(data.order.total));
        setOrderId(data.order.id);
      }
    } catch (error) {
      console.error("Error al obtener pedido activo:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedVariant || !quantity) return;

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/order/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tableId: table.id,
          products: [{ variantId: selectedVariant, quantity: parseInt(quantity) }],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchActiveOrder();
        setSelectedVariant("");
        setQuantity("");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleCloseOrder = async () => {
    const defaultCustomerId = "657b3835-19a6-4068-b5c6-e85ed8bd0504";

    if (paymentMethod === "efectivo" && parseFloat(amountReceived) < total) {
      toast({
        title: "Monto insuficiente",
        description: "El dinero recibido no cubre el total",
        status: "warning",
      });
      return;
    }

    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/order/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderId,
          customerId: defaultCustomerId,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al cerrar pedido");

      toast({
        title: "Pedido pagado y venta registrada",
        description: `Referencia: ${data.sale.reference}`,
        status: "success",
      });

      onClose();
      setIsSummaryVisible(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Pedido - Mesa {table?.number}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {!isSummaryVisible && (
              <>
                <Select
                  placeholder="Selecciona producto"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.variantId} value={p.variantId}>
                      {p.label}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <Button onClick={handleAddProduct} colorScheme="blue">
                  Agregar Producto
                </Button>
              </>
            )}

            <Text fontWeight="bold">Productos en el pedido:</Text>
            {orderDetails.length === 0 ? (
              <Text color="gray.500">No hay productos aún</Text>
            ) : (
              orderDetails.map((item, idx) => (
                <Text key={idx} fontSize="sm">
                  {item.productVariant
                    ? `${item.productVariant.vatiantName} - ${item.productVariant.Product?.name}`
                    : item.combo
                    ? `🟨 Combo: ${item.combo.name}`
                    : "🟥 Producto desconocido"}{" "}
                  x {item.quantity} = ${parseFloat(item.total).toLocaleString()}
                </Text>
              ))
            )}

            <Text fontWeight="bold" mt={2}>
              Total del pedido: ${total.toLocaleString()}
            </Text>

            <Select
              placeholder="Método de pago"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="nequi">Nequi</option>
            </Select>

            {isSummaryVisible && (
              <>
                <Input
                  placeholder="Dinero recibido"
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  disabled={paymentMethod === "nequi" || paymentMethod === "tarjeta"}
                />
                <Text>
                  Cambio: ${Math.max(0, parseFloat(amountReceived || 0) - total).toLocaleString()}
                </Text>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          {!isSummaryVisible ? (
            <Button colorScheme="green" onClick={() => setIsSummaryVisible(true)}>
              Pagar y cerrar pedido
            </Button>
          ) : (
            <Button colorScheme="green" onClick={handleCloseOrder}>
              Confirmar pago
            </Button>
          )}
          <Button ml={3} onClick={onClose} variant="ghost">
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditOrderModal;

  
  
  