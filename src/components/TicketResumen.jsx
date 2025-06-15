import React, { forwardRef } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const TicketResumenHTML = forwardRef(({ data }, ref) => {
  const { cashRegister, productSummary, comboSummary } = data || {};

  const totalCombosCOP = comboSummary?.reduce(
    (acc, c) => acc + Number(c.totalRevenue || 0),
    0
  );

  return (
    <div
      ref={ref}
      id="ticketPrintArea"
      style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        margin: '0',
        padding: '0',
      }}
    >
      {/* Título y Encabezado */}
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        ===========================
        <br />
        RESUMEN CIERRE DE CAJA
        <br />
        ===========================
      </div>

      {/* Información del Cajero */}
      <VStack align="start" spacing={0} mt={2}>
        <Text>Cajero: {cashRegister?.User?.name || 'Usuario'}</Text>
        <Text>Apertura: {new Date(cashRegister?.openedAt).toLocaleString()}</Text>
        <Text>Cierre: {new Date(cashRegister?.closedAt).toLocaleString()}</Text>
      </VStack>

      {/* Movimientos */}
      <Text mt={2}>
        ---------------------------<br />
        MOVIMIENTOS<br />
        ---------------------------
      </Text>

      <VStack align="start" spacing={0}>
        <Text>Apertura: ${parseFloat(cashRegister?.openingAmount || 0).toLocaleString()}</Text>
        <Text>Ventas: ${parseFloat(cashRegister?.totalSales || 0).toLocaleString()}</Text>
        <Text>Ingresos: ${parseFloat(cashRegister?.totalIncome || 0).toLocaleString()}</Text>
        <Text>Gastos: ${parseFloat(cashRegister?.totalWithdrawals || 0).toLocaleString()}</Text>
      </VStack>

      {/* Total Final */}
      <Text mt={1} fontWeight="bold">
        TOTAL FINAL: ${parseFloat(cashRegister?.closingAmount || 0).toLocaleString()}
      </Text>

      {/* Resumen por Producto */}
      <Text mt={2} fontWeight="bold">
        ---------------------------<br />
        RESUMEN POR PRODUCTO <br />
        ***************************
      </Text>

      {productSummary?.length > 0 ? (
        productSummary.map((p, idx) => (
          <Box key={idx} mb={1}>
            <Text>----------------------</Text>
            <Text fontWeight="semibold">
              {p.productVariant?.vatiantName}-{p.productVariant?.Product?.name || 'Prod'}
            </Text>
            <Text fontSize="xs">
              Inicial: {p.initialQuantity} Recibidos: {p.receivedQuantity}<br />
              Dañados: {p.damagedQuantity} Vendidos: {p.soldQuantity}<br />
              Final: {p.finalQuantity}
            </Text>
            <Text>----------------------</Text>
          </Box>
        ))
      ) : (
        <Text fontSize="xs" color="gray.500">
          Sin productos
        </Text>
      )}

      {/* Resumen Ventas */}
      <Text mt={2} fontWeight="bold">
        --------------------<br />
        RESUMEN VENTAS<br />
        *********************
      </Text>

      {comboSummary?.length > 0 ? (
        comboSummary.map((combo, idx) => (
          <Box key={idx} mb={1}>
            <Text>------------------------</Text>
            <Text fontWeight="semibold">{combo.combo?.name || 'Combo'}</Text>
            <Text fontSize="xs">
              Vendidos: {combo.totalSold} | Total: {combo.totalRevenueFormatted}
            </Text>
            <Text>-------------------------</Text>
          </Box>
        ))
      ) : (
        <Text fontSize="xs" color="gray.500">
          Sin ventas
        </Text>
      )}

      {comboSummary?.length > 0 && (
        <Text mt={1} fontWeight="bold">
          TOTAL VENTAS: ${totalCombosCOP.toLocaleString()}
        </Text>
      )}

      {/* Footer */}
      <Text textAlign="center" mt={2} fontWeight="bold">
        ========================{"\n"}
        Magnus Control 1.0{"\n"}
        ========================
      </Text>
    </div>
  );
});

export default TicketResumenHTML;


