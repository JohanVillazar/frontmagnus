import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Heading,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const CashSummary = () => {
  const [data, setData] = useState({
    totalGeneral: 0,
    productosVendidos: [],
    productos: [],
    ingresos: [],
    gastos: [],
  });

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    // Recuperar el token del localStorage
    const token = localStorage.getItem("token");

    // Si no hay token, manejar la situación (puedes redirigir al login o mostrar un mensaje)
    if (!token) {
      console.error("Token no encontrado. El usuario debe iniciar sesión.");
      return; // Detener ejecución si no hay token
    }

    try {
      // Realizar la solicitud al backend con el token en los encabezados
      const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/open-summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener los datos de la caja");

      const json = await res.json();
      setData(json); // Aquí se actualiza el estado con los datos recibidos
    } catch (err) {
      console.error("Error al cargar resumen de caja:", err);
    }
  };

  fetchData();
}, []); // El useEffect se ejecuta solo una vez cuando el componente se monta




  if (!data.productosVendidos.length && !data.productos.length) {
    return <Text>Cargando datos...</Text>; // Muestra un mensaje de carga mientras los datos no estén listos
  }

  
return (
  <Box p={6} maxW="1200px" mx="auto" bg="white" borderRadius="lg" boxShadow="sm">
    {/* Encabezado con total general */}
    <Stack direction={['column', 'row']} justifyContent="space-between" mb={8} align={['flex-start', 'center']}>
      <Heading size="xl" color="violet.700" fontWeight="semibold" letterSpacing="wide">
        Parcial de Caja
      </Heading>
      <Stat 
        textAlign={['left', 'right']} 
        minW="220px" 
        p={4} 
        bg="orange.780" 
        borderRadius="lg"
        border="1px solid"
        borderColor="orange.550"
      >
        <StatLabel color="violet.600" fontSize="sm" fontWeight="medium">Dinero en Caja</StatLabel>
        <StatNumber color="violet.800" fontSize="2xl" fontWeight="bold">
          ${data.totalGeneral}
        </StatNumber>
      </Stat>
    </Stack>

    {/* Pestañas */}
    <Tabs 
      index={tabIndex} 
      onChange={setTabIndex} 
      variant="soft-rounded" 
      colorScheme="violet"
      isLazy
    >
      <TabList mb={6} flexWrap="wrap">
        <Tab 
          mx={2} 
          mb={2}
          _selected={{ 
            color: "white", 
            bg: "teal.500",
            boxShadow: "md"
          }}
          borderRadius="full"
          boxShadow="base"
        >
          <Stack direction="row" align="center">
            <Text>Ventas</Text>
            <Badge 
              colorScheme="green" 
              borderRadius="full" 
              px={2}
              boxShadow="sm"
            >
              {data.productosVendidos.length}
            </Badge>
          </Stack>
        </Tab>
        <Tab 
          mx={2} 
          mb={2}
          _selected={{ 
            color: "white", 
            bg: "teal.500",
            boxShadow: "md"
          }}
          borderRadius="full"
          boxShadow="base"
        >
          Movimientos
        </Tab>
        <Tab 
          mx={2} 
          mb={2}
          _selected={{ 
            color: "white", 
            bg: "teal.500",
            boxShadow: "md"
          }}
          borderRadius="full"
          boxShadow="base"
        >
          <Stack direction="row" align="center">
            <Text>Ingresos</Text>
            <Badge 
              colorScheme="teal" 
              borderRadius="full" 
              px={2}
              boxShadow="sm"
            >
              {data.ingresos.length}
            </Badge>
          </Stack>
        </Tab>
        <Tab 
          mx={2} 
          mb={2}
          _selected={{ 
            color: "white", 
            bg: "red.400",
            boxShadow: "md"
          }}
          borderRadius="full"
          boxShadow="base"
        >
          <Stack direction="row" align="center">
            <Text>Gastos</Text>
            <Badge 
              colorScheme="red" 
              borderRadius="full" 
              px={2}
              boxShadow="sm"
            >
              {data.gastos.length}
            </Badge>
          </Stack>
        </Tab>
      </TabList>

      <TabPanels>
        {/* Pestaña 1: Ventas */}
        <TabPanel p={0}>
          <Box 
            border="1px solid" 
            borderColor="gray.100" 
            borderRadius="xl" 
            overflow="hidden"
            boxShadow="sm"
          >
            <TableContainer>
              <Table variant="simple">
                <Thead bg="teal.50">
                  <Tr>
                    <Th color="teal.700" borderColor="gray.200">Producto</Th>
                    <Th color="teal.700" borderColor="gray.200">Presentación</Th>
                    <Th color="teal.700" borderColor="gray.200" isNumeric>Cantidad</Th>
                    <Th color="teal.700" borderColor="gray.200" isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.productosVendidos.map((item, index) => (
                    <Tr key={index} _hover={{ bg: "gray.50" }}>
                      <Td borderColor="gray.100">{item.productName}</Td>
                      <Td borderColor="gray.100">{item.variantName}</Td>
                      <Td borderColor="gray.100" isNumeric>{item.cantidad}</Td>
                      <Td borderColor="gray.100" isNumeric fontWeight="bold" color="teal.600">
                        ${item.total}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Pestaña 2: Movimientos de productos */}
        <TabPanel p={0}>
          <Box 
            border="1px solid" 
            borderColor="gray.100" 
            borderRadius="xl" 
            overflow="hidden"
            boxShadow="sm"
          >
            <TableContainer>
              <Table variant="simple">
                <Thead bg="teal.50">
                  <Tr>
                    <Th color="teal.700" borderColor="gray.200">Producto</Th>
                    <Th color="teal.700" borderColor="gray.200">Presentación</Th>
                    <Th color="teal.700" borderColor="gray.200" isNumeric>Recibido</Th>
                    <Th color="teal.700" borderColor="gray.200" isNumeric>Vendido</Th>
                    <Th color="teal.700" borderColor="gray.200" isNumeric>Dañado</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.productos.map((item, index) => (
                    <Tr key={index} _hover={{ bg: "gray.50" }}>
                      <Td borderColor="gray.100">{item.productName}</Td>
                      <Td borderColor="gray.100">{item.variantName}</Td>
                      <Td borderColor="gray.100" isNumeric>{item.received}</Td>
                      <Td borderColor="gray.100" isNumeric color="teal.500">{item.sold}</Td>
                      <Td borderColor="gray.100" isNumeric color="red.500">{item.damaged}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Pestaña 3: Ingresos */}
        <TabPanel p={0}>
          <Box 
            border="1px solid" 
            borderColor="gray.100" 
            borderRadius="xl" 
            overflow="hidden"
            boxShadow="sm"
          >
            <TableContainer>
              <Table variant="simple">
                <Thead bg="teal.50">
                  <Tr>
                    <Th color="teal.700" borderColor="gray.200">Descripción</Th>
                    <Th color="teal.700" borderColor="gray.200" isNumeric>Monto</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.ingresos.map((item, index) => (
                    <Tr key={index} _hover={{ bg: "gray.50" }}>
                      <Td borderColor="gray.100">{item.description}</Td>
                      <Td borderColor="gray.100" isNumeric fontWeight="bold" color="teal.600">
                        ${item.amount}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Pestaña 4: Gastos */}
        <TabPanel p={0}>
          <Box 
            border="1px solid" 
            borderColor="gray.100" 
            borderRadius="xl" 
            overflow="hidden"
            boxShadow="sm"
          >
            <TableContainer>
              <Table variant="simple">
                <Thead bg="red.50">
                  <Tr>
                    <Th color="red.700" borderColor="gray.200">Descripción</Th>
                    <Th color="red.700" borderColor="gray.200" isNumeric>Monto</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.gastos.map((item, index) => (
                    <Tr key={index} _hover={{ bg: "gray.50" }}>
                      <Td borderColor="gray.100">{item.description}</Td>
                      <Td borderColor="gray.100" isNumeric fontWeight="bold" color="red.500">
                        ${item.amount}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
  
);   
};

export default CashSummary;


