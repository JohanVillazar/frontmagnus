import {
  Box,
  Text,
  Badge,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const PurchaseCardList = () => {
  const [purchases, setPurchases] = useState([]);
  const toast = useToast();

  const fetchPurchases = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/purchase/recent", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.error("Error cargando compras:", err);
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      const res = await fetch(`https://backmagnus-production.up.railway.app/api/purchase/${id}/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "pagada" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast({ title: "Compra actualizada", status: "success" });
      fetchPurchases(); // Refresh list
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Compras Recientes
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {purchases.map((purchase) => (
          <Box
            key={purchase.reference}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            p={4}
            borderLeft="5px solid"
            borderColor={purchase.status === "pagada" ? "green.400" : "orange.400"}
          >
            <VStack align="start" spacing={2}>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Referencia:</Text>
                <Text>{purchase.reference}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Usuario:</Text>
                <Text>{purchase.User?.name} {purchase.User?.lastName}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Sucursal:</Text>
                <Text>{purchase.Sucursal?.name || "N/A"}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Total:</Text>
                <Text>${purchase.totalAmount.toLocaleString()}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Fecha:</Text>
                <Text>{new Date(purchase.createdAt).toLocaleString("es-CO")}</Text>
              </HStack>
              <Badge
                colorScheme={purchase.status === "pagada" ? "green" : "orange"}
                fontSize="sm"
              >
                {purchase.status.toUpperCase()}
              </Badge>
              {purchase.status === "pendiente" && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleStatusUpdate(purchase.id)}
                  mt={2}
                >
                  Marcar como pagada
                </Button>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PurchaseCardList;
