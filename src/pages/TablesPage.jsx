import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TableCard from "../components/TableCard";
import { FaCalendar, FaChair, FaCheckCircle, FaClock, FaPlus, FaResolving, FaTable } from "react-icons/fa";
import CreateOrderModal from "../components/CreateOrderModal";
import EditOrderModal from "../components/EditOrderModal";
import CreateTableModal from "../components/CreateTableModal";
import ReserveTableModal from "../components/ReserveTableModal";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false);
  const [isReserveTableOpen, setIsReserveTableOpen] = useState(false);

  const fetchTables = async () => {
    const res = await fetch("https://backmagnus-production.up.railway.app/api/table/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setTables(Array.isArray(data) ? data : data.tables || []);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const filtered = (status) => tables.filter((t) => t.status === status);

  const handleTableClick = (table) => {
    setSelectedTable(table);
  
    if (table.status === "disponible" || table.status === "reservada") {
      setIsCreateOrderOpen(true);
    } else if (table.status === "ocupada") {
      setIsEditOrderOpen(true);
    }
  };



  return (
    <Box p={{ base: 4, md: 8 }}>
    <Flex justify="space-between" align="center" mb={6}>
  <Heading size="lg">Gestión de Mesas</Heading>
  <Flex gap={2}>
    <Button colorScheme="purple" leftIcon={<FaPlus />} onClick={() => setIsCreateTableOpen(true)}>
      Agregar Mesa
    </Button>

    <Button colorScheme="orange" leftIcon={<FaCalendar />} onClick={() => setIsReserveTableOpen(true)}>
      Reservar
    </Button>
     <Button colorScheme="blue" leftIcon={<FaResolving />} onClick={() => window.location.reload()}>
      Refrescar Datos
    </Button>
    
  </Flex>
</Flex>


      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Box bg="white" p={4} rounded="md" boxShadow="md">
          <Flex align="center" gap={2}>
            <Icon as={FaCheckCircle} color="green.500" />
            <Text fontWeight="bold">Mesas Disponibles</Text>
          </Flex>
          <Text fontSize="3xl" mt={2}>{filtered("disponible").length}</Text>
        </Box>
        <Box bg="white" p={4} rounded="md" boxShadow="md">
          <Flex align="center" gap={2}>
            <Icon as={FaChair} color="red.500" />
            <Text fontWeight="bold">Mesas Ocupadas</Text>
          </Flex>
          <Text fontSize="3xl" mt={2}>{filtered("ocupada").length}</Text>
        </Box>
        <Box bg="white" p={4} rounded="md" boxShadow="md">
          <Flex align="center" gap={2}>
            <Icon as={FaClock} color="yellow.500" />
            <Text fontWeight="bold">Mesas Reservadas</Text>
          </Flex>
          <Text fontSize="3xl" mt={2}>{filtered("reservada").length}</Text>
        </Box>
      </SimpleGrid>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb={4}>
          <Tab>Todos</Tab>
          <Tab>Disponibles</Tab>
          <Tab>Ocupadas</Tab>
          <Tab>Reservadas</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
              {tables.map((table) => (
                <Box key={table.id} onClick={() => handleTableClick(table)} cursor="pointer">
                  <TableCard table={table} />
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
              {filtered("disponible").map((table) => (
                <Box key={table.id} onClick={() => handleTableClick(table)} cursor="pointer">
                  <TableCard table={table} />
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
              {filtered("ocupada").map((table) => (
                <Box key={table.id} onClick={() => handleTableClick(table)} cursor="pointer">
                  <TableCard table={table} />
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
              {filtered("reservada").map((table) => (
                <Box key={table.id} onClick={() => handleTableClick(table)} cursor="pointer">
                  <TableCard table={table} />
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        table={selectedTable}
        onOrderSuccess={fetchTables}
      />
      <EditOrderModal
        isOpen={isEditOrderOpen}
        onClose={() => setIsEditOrderOpen(false)}
        table={selectedTable}
      />
      <CreateTableModal
        isOpen={isCreateTableOpen}
        onClose={() => setIsCreateTableOpen(false)}
        onSuccess={fetchTables}
      />

<ReserveTableModal
  isOpen={isReserveTableOpen}
  onClose={() => setIsReserveTableOpen(false)}
  onSuccess={fetchTables}
/>

    </Box>
  );
};

export default TablesPage;



