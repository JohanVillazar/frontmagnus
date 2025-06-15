import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    VStack,
    IconButton,
    Collapse,
    Input,
    HStack,
    Button,
    Spinner,
  } from "@chakra-ui/react";
  import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
  import { useState, useEffect } from "react";
  
  const SalesReportTab = () => {
    const [report, setReport] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
  
    const fetchReport = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
  
        const res = await fetch(`https://backmagnus-production.up.railway.app/api/sale/report?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setReport(data.report);
      } catch (err) {
        console.error("Error al cargar reporte de ventas", err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchReport();
    }, []);
  
    const toggleRow = (i) => {
      setExpandedRows((prev) => ({ ...prev, [i]: !prev[i] }));
    };
  
    return (
      <Box>
        <Heading size="md" mb={1}>Reporte de Ventas</Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>Últimas 10 ventas registradas</Text>
  
        <HStack mb={4} spacing={4}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button onClick={fetchReport} colorScheme="blue">
            Filtrar
          </Button>
        </HStack>
  
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th></Th>
                  <Th>Fecha</Th>
                  <Th>Referencia</Th>
                  <Th>Vendedor</Th>
                  <Th>Cliente</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {report.map((venta, i) => (
                  <>
                    <Tr key={i}>
                      <Td>
                        <IconButton
                          icon={expandedRows[i] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                          size="sm"
                          onClick={() => toggleRow(i)}
                          aria-label="Toggle"
                        />
                      </Td>
                      <Td>  {new Date(venta.fecha).toLocaleString("es-CO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</Td>
                      <Td>{venta.referencia}</Td>
                      <Td>{venta.usuario}</Td>
                      <Td>{venta.cliente}</Td>
                      <Td fontWeight="bold">
                        ${venta.productos.reduce((acc, p) => acc + parseFloat(p.precioTotal), 0).toLocaleString()}
                      </Td>
                    </Tr>

                    <Tr>
                      <Td colSpan={6} p={0}>
                        <Collapse in={expandedRows[i]} animateOpacity>
                          <Box p={4} bg="gray.50">
                            <Text fontWeight="semibold" mb={2}>Productos</Text>
                            <VStack align="start" spacing={1} pl={2}>
                              {venta.productos.map((p, idx) => (
                                <Text key={idx} fontSize="sm">
                                  {p.producto.replace(/^Combo:\s*/i, "")} x {p.cantidad} = ${parseFloat(p.precioTotal).toLocaleString()}
                                </Text>


                              ))}
                            </VStack>
                          </Box>
                        </Collapse>
                      </Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    );
  };
  
  export default SalesReportTab;
  
  