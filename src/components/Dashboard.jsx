import React, { useEffect, useState, lazy, Suspense, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Text,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Divider
} from "@chakra-ui/react";
import {
  CircleDollarSign,
  ChartBarIcon,
  UsersIcon,
  Boxes,
  BanknoteArrowUp,
  ShoppingBag,
} from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

const SalesReport = lazy(() => import("./SalesReport"));
const CashSummary = lazy(() => import("./CashSummary"));

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SummaryCard = React.memo(({ label, value, change, icon, iconColor }) => (
  <Box bg="white" borderRadius="xl" boxShadow="md" p={5}>
    <Flex justify="space-between" align="center">
      <Box>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>{value}</StatNumber>
          <StatHelpText>{change}</StatHelpText>
        </Stat>
      </Box>
      <Box bg={`${iconColor}.100`} color={`${iconColor}.600`} p={3} borderRadius="full">
        <Icon as={icon} boxSize={6} />
      </Box>
    </Flex>
  </Box>
));

const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const Dashboard = () => {
  const [salesSummary, setSalesSummary] = useState({ count: 0, totalAmount: 0 });
  const [topProducts, setTopProducts] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [cashMovements, setCashMovements] = useState([]);
  const [lowStockVariants, setLowStockVariants] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async (url, setter) => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setter(data);
    };

    fetchData("https://backmagnus-production.up.railway.app/api/sale/all", setSalesSummary);
    fetchData("https://backmagnus-production.up.railway.app/api/sale/top-products", setTopProducts);
    fetchData("https://backmagnus-production.up.railway.app/api/sale/weekly-sales", setWeeklySales);
    fetchData("https://backmagnus-production.up.railway.app/api/cash/movements", setCashMovements);
    fetchData("https://backmagnus-production.up.railway.app/api/variant/all", (data) => {
      const low = [];
      data.forEach((product) => {
        product.variants.forEach((v) => {
          if (v.totalunitstock <= 5) {
            low.push({
              productName: product.name,
              variantName: v.vatiantName,
              stock: v.totalunitstock,
            });
          }
        });
      });
      setLowStockVariants(low);
    });
    fetchData("https://backmagnus-production.up.railway.app/api/purchase/summary", (data) => setTotalPurchases(data.totalAmount));
    fetchData("https://backmagnus-production.up.railway.app/api/purchase/recent", setRecentPurchases);
  }, []);

  const totalWeekSales = useMemo(() => weeklySales.reduce((sum, day) => sum + parseFloat(day.total), 0), [weeklySales]);

  const topProductChartData = useMemo(() => ({
  labels: topProducts.map((p) => p.nombre || "Desconocido"),
  datasets: [
    {
      label: "Vendidos",
      data: topProducts.map((p) => parseInt(p.cantidad)),
      backgroundColor: topProducts.map(() => getRandomColor()),
    },
  ],
}), [topProducts]);


  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }), []);

  return (
    <Box p={{ base: 4, md: 8 }} ml={{ base: 0, md: "250px" }}>
      <Heading mb={6}>Dashboard</Heading>

      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={6}
      >
        <SummaryCard
          label="Ingresos en Ventas"
          value={`$${parseFloat(salesSummary.totalAmount).toLocaleString()}`}
          change="Ventas de hoy"
          icon={CircleDollarSign}
          iconColor="orange"
        />
        <SummaryCard
          label="Ventas"
          value={`+${salesSummary.count}`}
          change="Cantidad de Ventas realizadas Hoy "
          icon={ChartBarIcon}
          iconColor="blue"
        />
        <SummaryCard
          label="Ventas en la semana"
          value={`$${totalWeekSales.toLocaleString()}`}
          change="Últimos 7 días"
          icon={BanknoteArrowUp}
          iconColor="red"
        />
        <SummaryCard
          label="Compras"
          value={`$${parseFloat(totalPurchases).toLocaleString()}`}
          change="Recientes"
          icon={ShoppingCart}
          iconColor="purple"
        />
      </Grid>

      <Tabs variant="soft-rounded" colorScheme="blue" mt={10}>
        <TabList mb={4}>
          <Tab>Metricas</Tab>
          <Tab>Parcial de caja</Tab>
          <Tab>Ventas</Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
  {/* 🟣 Sección de Top Productos y Movimientos */}
  <Grid
    templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
    gap={6}
    mb={6}
    alignItems="start"
  >
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" overflowX="auto">
      <Heading size="md" mb={1}>Top Productos</Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>Productos más Vendidos</Text>
      <Box minW="300px" maxW="1000px" w="full" mx="auto">
        <Bar data={topProductChartData} options={chartOptions} />
      </Box>
    </Box>

    <Box
  bg="white"
  p={6}
  borderRadius="lg"
  boxShadow="md"
  maxH={{ base: "300px", md: "350px", lg: "400px" }} // altura limitada por pantalla
  overflowY="auto" // scroll interno si se pasa
>
  <Heading size="md" mb={1}>Movimientos de Caja</Heading>
  <Text fontSize="sm" color="gray.500" mb={4}>Recientes</Text>

  <VStack align="stretch" spacing={4}>
    {cashMovements.slice(-8).reverse().map((m, idx) => (
      <HStack key={idx} justify="space-between">
        <Box>
          <Text fontWeight="medium">{m.description || "Movimiento"}</Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(m.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </Box>
        <Text
          fontWeight="bold"
          color={m.type === "ingreso" ? "green.500" : "red.500"}
        >
          {m.type === "ingreso" ? "+" : "-"}${parseFloat(m.amount).toLocaleString()}
        </Text>
      </HStack>
    ))}
  </VStack>
</Box>


   
  </Grid>

  {/* 🟢 Sección separada para Compras y Stock */}
  <Grid
    templateColumns={{ base: "1fr", md: "1fr", lg: "1fr 1fr" }}
    gap={6}
  >
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={1}>Últimas Compras</Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>Durante el turno actual</Text>

      <VStack align="stretch" spacing={4} divider={<Divider />}>
        {recentPurchases.map((purchase, idx) => (
          <HStack key={idx} justify="space-between" align="start">
            <Box w="full">
              <Text fontWeight="medium">{purchase.reference}</Text>
              <Text fontSize="sm" color="gray.500" mb={1}>
                - Responsable: {purchase.User?.name} {purchase.User?.lastName} — Sucursal: {purchase.Sucrusal?.name}
                <br />
                {new Date(purchase.createdAt).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              <VStack align="start" spacing={0}>
                {purchase.PurchaseDetails?.map((detail, i) => (
                  <Text key={i} fontSize="sm" color="gray.700">
                    {detail.quantity} x {detail.productVariant?.Product?.name || "Producto desconocido"}
                  </Text>
                ))}
              </VStack>
            </Box>

            <VStack spacing={0} align="end" minW="100px">
              <Text
                fontWeight="bold"
                color={purchase.status === "pagada" ? "green.500" : "red.400"}
              >
                ${parseFloat(purchase.totalAmount).toLocaleString()}
              </Text>
              <Text
                fontSize="xs"
                bg={purchase.status === "pagada" ? "green.100" : "orange.100"}
                color={purchase.status === "pagada" ? "green.600" : "orange.600"}
                px={2}
                py={0.5}
                borderRadius="full"
              >
                {purchase.status}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Box>

    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={1}>Alertas de Stock</Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>Productos con inventario bajo</Text>

      <VStack align="stretch" spacing={0} divider={<Box borderBottom="1px" borderColor="gray.100" />}>
        {lowStockVariants.map((item, idx) => {
          const color =
            item.stock <= 3 ? "red.500" : item.stock <= 10 ? "orange.500" : "green.500";
          return (
            <HStack key={idx} justify="space-between" py={2}>
              <Box>
                <Text fontWeight="medium">{item.productName}</Text>
                <Text fontSize="sm" color="gray.500">{item.variantName}</Text>
              </Box>
              <Text fontWeight="bold" color={color}>
                {item.stock} unidades
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  </Grid>
</TabPanel>

       

          <TabPanel>
            <Suspense fallback={<div>Loading...</div>}>
              <CashSummary />
            </Suspense>
          </TabPanel>

          <TabPanel>
            <Suspense fallback={<div>Loading...</div>}>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md" overflowX="auto">
                <Heading size="md" mb={1}></Heading>
                <Text fontSize="sm" color="gray.500" mb={6}></Text>
                <SalesReport />
              </Box>
            </Suspense>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;




