import {
    Box,
    Button,
    Heading,
    Text,
    useToast,
    VStack,
    Alert,
    AlertIcon,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  
  const CashClosePanel = ({ onCloseSuccess }) => {
    const [closingData, setClosingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const handleCloseCash = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/close", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al cerrar caja");
  
        toast({
          title: "Caja cerrada correctamente",
          status: "success",
        });
  
        // Borrar el ID del localStorage
        localStorage.removeItem("cashRegisterId");
  
        // Guardamos para mostrar resumen
        setClosingData(data);
        onCloseSuccess?.(); // para ocultar paneles, si se maneja desde CashOpenPage
      } catch (err) {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>
          Cierre de Caja
        </Heading>
  
        {!closingData ? (
          <VStack align="stretch" spacing={4}>
            <Text>Al cerrar la caja se generará el consolidado del turno.</Text>
            <Button
              colorScheme="red"
              onClick={handleCloseCash}
              isLoading={loading}
            >
              Cerrar caja
            </Button>
          </VStack>
        ) : (
          <Box>
            <Alert status="success" mb={4}>
              <AlertIcon />
              Caja cerrada correctamente
            </Alert>
  
            <Text>
              Monto final:{" "}
              <strong>${parseFloat(closingData.cashRegister.closingAmount).toLocaleString()}</strong>
            </Text>
            <Text>
              Ventas: ${closingData.cashRegister.totalSales.toLocaleString()} | Ingresos: $
              {closingData.cashRegister.totalIncome.toLocaleString()} | Gastos: $
              {closingData.cashRegister.totalWithdrawals.toLocaleString()}
            </Text>
  
            {closingData.summaryPDF && (
              <Button
                mt={4}
                colorScheme="blue"
                as="a"
                href={`https://backmagnus-production.up.railway.app/${closingData.summaryPDF.replace(/\\/g, "/")}`}
                target="_blank"
                download
              >
                
              </Button>
            )}
          </Box>
        )}
      </Box>
    );
  };
  
  export default CashClosePanel;
  