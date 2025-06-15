import { Box, Text, VStack } from "@chakra-ui/react";
import { forwardRef } from "react";


const TicketParcialCaja = forwardRef(({ data }, ref) => {

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const {
    fecha = new Date(),
    
    totalGeneral = 0,
    productosVendidos = [],
    productos = [],
    ingresos = [],
    gastos = [],
    
  } = data || {};

  const totalIngresos = ingresos.reduce((sum, m) => sum + parseFloat(m.amount), 0);
  const totalGastos = gastos.reduce((sum, m) => sum + parseFloat(m.amount), 0);
  const saldo = totalGeneral + totalIngresos - totalGastos;

  return (
    <Box
      ref={ref}
      bg="white"
      p={2}
      w="60mm"
      fontFamily="monospace"
      fontSize="sm"
      whiteSpace="pre-wrap"
    >
      {/* Estilo de impresión */}
      <style>
        {`@media print {
          body * { visibility: hidden; }
          #ticketPrintArea, #ticketPrintArea * { visibility: visible; }
          #ticketPrintArea {
            position: absolute; left: 0; top: 0;
            width: 58mm; padding: 0; margin: 0;
          }
        }`}
      </style>

      <Text textAlign="center" fontWeight="bold">
        ==========================<br />
        PARCIAL DE CAJA<br />
        ==========================
      </Text>

      <VStack align="start" spacing={0} mt={2}>
        <Text>Fecha:   {new Date(fecha).toLocaleString()}</Text>
        <Text>Cajero: {usuario?.name} {usuario?.lastName}</Text>
      </VStack>

      <Text mt={2}>
        ---------------------------<br />
        VENTAS TOTALES<br />
        ---------------------------
      </Text>
      <Text fontWeight="bold">${totalGeneral.toLocaleString()}</Text>

      <Text mt={2} fontWeight="bold">
        ---------------------------<br />
        PRODUCTOS VENDIDOS<br />
        ---------------------------
      </Text>
      {productosVendidos.length > 0 ? (
        productosVendidos.map((p, i) => (
          <Box key={i} mb={1}>
            <Text>
              {p.productName} - {p.variantName}
            </Text>
            <Text fontSize="xs">
              Cant: {p.cantidad} | ${p.total.toLocaleString()}
            </Text>
          </Box>
        ))
      ) : (
        <Text fontSize="xs" color="gray.500">Sin ventas</Text>
      )}

      <Text mt={2} fontWeight="bold">
        ---------------------------<br />
        MOVIMIENTOS DE PRODUCTOS<br />
        ---------------------------
      </Text>
      {productos.length > 0 ? (
        productos.map((p, i) => (
          <Box key={i} mb={1}>
            <Text fontWeight="semibold">
              {p.productName} - {p.variantName}
            </Text>
              
            <Text fontSize="xs">
              Ingresos:{p.received}  Daños:{p.damaged} Vendidos:{p.sold}
            </Text>
          </Box>
        ))
      ) : (
        <Text fontSize="xs" color="gray.500">Sin movimientos</Text>
      )}

      <Text mt={2} fontWeight="bold">
        ---------------------------<br />
        INGRESOS<br />
        ---------------------------
      </Text>
      {ingresos.length > 0 ? (
        ingresos.map((m, i) => (
          <Text key={i} fontSize="xs">
            {m.description}: +${parseFloat(m.amount).toLocaleString()}
          </Text>
        ))
      ) : (
        <Text fontSize="xs" color="gray.500">Sin ingresos</Text>
      )}

      <Text mt={2} fontWeight="bold">
        ---------------------------<br />
        GASTOS<br />
        ---------------------------
      </Text>
      {gastos.length > 0 ? (
        gastos.map((m, i) => (
          <Text key={i} fontSize="xs">
            {m.description}: -${parseFloat(m.amount).toLocaleString()}
          </Text>
        ))
      ) : (
        <Text fontSize="xs" color="gray.500">Sin gastos</Text>
      )}

      <Text mt={2} fontWeight="bold">
        ---------------------------<br />
        SALDO NETO<br />
        ---------------------------
      </Text>
      <Text fontWeight="bold" fontSize="lg">
        ${saldo.toLocaleString()}
      </Text>

      <Text textAlign="center" mt={3} fontWeight="bold">
        ==========================<br />
        Magnus Control<br />
        ==========================
      </Text>
    </Box>
  );
});

export default TicketParcialCaja;
