import React, { useState, useRef } from 'react';
import { Box, Heading, Button, Alert, AlertIcon, VStack, useToast, Divider,Flex } from '@chakra-ui/react';
import { useReactToPrint } from 'react-to-print';
import TicketResumenHTML from '../components/TicketResumen'; // Asegúrate de que el path sea correcto

const CashClosePage = ({ onCloseSuccess }) => {
  const [closingData, setClosingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const ticketRef = useRef();

  // Función para cerrar la caja y obtener los datos del cierre
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

      localStorage.removeItem("cashRegisterId");
      setClosingData(data);
      onCloseSuccess?.();
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

  // Función para imprimir el recibo
  const handlePrint = useReactToPrint({
    content: () => ticketRef.current, // Referencia al componente de impresión
    documentTitle: "Cierre de Caja",
    pageStyle: `
      @page {
        size: auto;
        margin: 0;
      }
    `,
  });

  return (
    <Box ml="250px" p={6}>
      <Heading size="lg" mb={6}>
        Cierre de Caja
      </Heading>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" maxW="600px" w="100%">
        {!closingData ? (
          <VStack align="stretch" spacing={4}>
            <Alert status="info" mb={4}>
              <AlertIcon />
              Al cerrar la caja se generará el consolidado del turno.
            </Alert>
            <Button colorScheme="red" onClick={handleCloseCash} isLoading={loading}>
              Cerrar caja
            </Button>
          </VStack>
        ) : (
          <>
            <Alert status="success" mb={3}>
              <AlertIcon />
              Cierre Exitoso
            </Alert>

            {/* Botón para Imprimir */}
            <Button colorScheme="blue" onClick={handlePrint} mt={2}>
              Imprimir
            </Button>

            {/* Oculto pero imprimible - Referencia al componente TicketResumenHTML */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <TicketResumenHTML ref={ticketRef} data={closingData} />
            </div>

            {/* Vista previa del recibo en la página */}
            <Flex justify="center" mt={4}>
              <TicketResumenHTML data={closingData} />
            </Flex>

            <Divider my={4} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default CashClosePage;

