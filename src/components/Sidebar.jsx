import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  ListChecks,
  Component,
  Warehouse,
  LogOut,
  Store,
  ClipboardList,
  Users,
  Truck,
  UserCog,
} from "lucide-react";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box
      w="250px"
      h="100vh"
      position="fixed"
      top = "0"
      left = "0"
      bg="#62189e"
      color="white"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      zIndex="1000"
      
    >
      {/* TOP SECTION */}
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={6}>
          Magnus Control
        </Text>

        <VStack align="start" spacing={2} w="full">
          <NavItem icon={LayoutDashboard} to="/dashboard" label="Dashboard" />

          <Accordion allowToggle w="full">
            <AccordionItem border="none">
              <AccordionButton
                _hover={{ bg: "#f77700" }}
                px={3}
                py={2}
                borderRadius="md"
              >
                <Box flex="1" textAlign="left" display="flex" alignItems="center" gap={3}>
                  <Box as={Package} size="18px" />
                  <Text fontSize="sm">Productos y Recetas</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={3} pb={2}>
                <VStack align="start" spacing={1}>
                  <SubNavItem icon={Plus} to="/productos/nuevo" label="Crear Producto" />
                  <SubNavItem icon={ListChecks} to="/listar" label="Existencias" />
                  <SubNavItem icon={Plus} to="/combos/nuevo" label="Crear Receta" />
                  <SubNavItem icon={Component} to="/combos" label="Listar Recetas" />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Accordion allowToggle w="full">
            <AccordionItem border="none">
              <AccordionButton
                _hover={{ bg: "#f77700" }}
                px={3}
                py={2}
                borderRadius="md"
              >
                <Box flex="1" textAlign="left" display="flex" alignItems="center" gap={3}>
                  <Box as={Warehouse} size="18px" />
                  <Text fontSize="sm">Caja</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={3} pb={2}>
                <VStack align="start" spacing={1}>
                  <SubNavItem icon={Plus} to="/caja/abrir" label="Gestión de Caja" />
                  <SubNavItem icon={LogOut} to="/caja/cerrar" label="Cerrar Caja" />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <NavItem icon={Store} to="/mesas" label="Mesas" />
          <NavItem icon={ClipboardList} to="/compras/nueva" label="Compras" />
          <NavItem icon={Users} to="/clientes" label="Clientes" />
          <NavItem icon={Truck} to="/suppliers" label="Proveedores" />
          <NavItem icon={UserCog} to="/users" label="Usuarios" />
        </VStack>
      </Box>

      {/* USER FOOTER */}
      <Box mt={6}>
        {user ? (
          <HStack spacing={3} align="center">
            <Avatar size="sm" name={`${user.name} ${user.lastName || ""}`} />
            <Box>
              <Text fontWeight="bold" color="white">
                {user.name} {user.lastName || ""}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.700">{user.email}</Text>
            </Box>
          </HStack>
        ) : (
          <Text fontSize="sm" color="whiteAlpha.700">
            Cargando usuario...
          </Text>
        )}

        <Button
          leftIcon={<Icon as={LogOut} />}
          variant="ghost"
          colorScheme="black"
          w="full"
          mt={4}
          onClick={handleLogout}
          justifyContent="flex-start"
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link
    as={NavLink}
    to={to}
    display="flex"
    alignItems="center"
    px={3}
    py={2}
    gap={3}
    borderRadius="md"
    _hover={{ bg: "#f77700" }}
    _activeLink={{ bg: "gray.800", fontWeight: "bold" }}
    w="full"
  >
    <Box as={icon} size="18px" />
    <Text fontSize="sm">{label}</Text>
  </Link>
);

const SubNavItem = ({ to, icon, label }) => (
  <Link
    as={NavLink}
    to={to}
    display="flex"
    alignItems="center"
    px={2}
    py={1}
    gap={2}
    borderRadius="md"
    fontSize="sm"
    _hover={{ bg: "gray.700" }}
    _activeLink={{ bg: "gray.700", fontWeight: "bold" }}
    w="full"
  >
    <Box as={icon} size="16px" />
    {label}
  </Link>
);

export default Sidebar;

