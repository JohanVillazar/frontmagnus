// components/SidebarContent.jsx
import {
  Box, VStack, Accordion, AccordionItem, AccordionButton, AccordionIcon,
  AccordionPanel, Text, HStack, Avatar, Button, Icon, Link, Flex
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Plus, ListChecks, Component, Warehouse, LogOut, Store, ClipboardList, Users, Truck, UserCog,Hotel,PlayCircle,NotebookPen,ShoppingBasket,UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth();


  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Flex
      direction="column"
      h="100vh"
      w={{ base: "full", md: "250px" }}
      bg="#62189e"
      color="white"
      p={4}
    >
      {/* Parte superior */}
      <Box mb={6}>
        <Text fontSize="xl" fontWeight="bold">
          Magnus Control
        </Text>
      </Box>

      {/* Menú de navegación */}
      <VStack align="start" spacing={2} w="full" flex="1" overflowY="auto">
        <NavItem icon={LayoutDashboard} to="/dashboard" label="Dashboard" onClick={onClose} />

        <Accordion allowToggle w="full">
          <AccordionItem border="none">
            <AccordionButton _hover={{ bg: "#f77700" }} px={3} py={2} borderRadius="md">
              <Box flex="1" textAlign="left" display="flex" alignItems="center" gap={3}>
                <Box as={Package} size="18px" />
                <Text fontSize="sm">Productos y Recetas</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={3} pb={2}>
              <VStack align="start" spacing={1}>
                <SubNavItem icon={Plus} to="/productos/nuevo" label="Crear Producto" onClick={onClose} />
                <SubNavItem icon={ListChecks} to="/listar" label="Existencias" onClick={onClose} />
                <SubNavItem icon={Plus} to="/combos/nuevo" label="Crear Receta" onClick={onClose} />
                <SubNavItem icon={Component} to="/combos" label="Listar Recetas" onClick={onClose} />
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion allowToggle w="full">
          <AccordionItem border="none">
            <AccordionButton _hover={{ bg: "#f77700" }} px={3} py={2} borderRadius="md">
              <Box flex="1" textAlign="left" display="flex" alignItems="center" gap={3}>
                <Box as={Warehouse} size="18px" />
                <Text fontSize="sm">Caja</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={3} pb={2}>
              <VStack align="start" spacing={1}>
                <SubNavItem icon={Plus} to="/caja/abrir" label="Gestión de Caja" onClick={onClose} />
                <SubNavItem icon={LogOut} to="/caja/cerrar" label="Cerrar Caja" onClick={onClose} />
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <NavItem icon={UtensilsCrossed} to="/mesas" label="Mesas" onClick={onClose} />
          {/* Desplegable compras */}
                  <Accordion allowToggle w="full">
                    <AccordionItem border="none">
                      <AccordionButton
                        _hover={{ bg: "#f77700" }}
                        px={3}
                        py={2}
                        borderRadius="md"
                      >
                        <Box flex="1" textAlign="left" display="flex" alignItems="center" gap={3}>
                          <Icon as={ShoppingBasket} boxSize={4} />
                          <Text fontSize="sm">Compras</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel px={3} pb={2}>
                        <VStack align="start" spacing={1}>
                          <SubNavItem icon={ClipboardList} to="/compras/nueva" label="Registrar Compra" />
                          <SubNavItem icon={NotebookPen} to="/compras/update" label="Gestionar Compras" />
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  {/* Fin Desplegable compras */}

        <NavItem icon={Users} to="/clientes" label="Clientes" onClick={onClose} />
        <NavItem icon={Hotel} to="/sucursales" label="Sucursales" />
        <NavItem icon={Truck} to="/suppliers" label="Proveedores" onClick={onClose} />
        <NavItem icon={UserCog} to="/users" label="Usuarios" onClick={onClose} />
        <NavItem icon={PlayCircle} to="/tutoriales" label="Ayuda" onClick={onClose} />
      </VStack>

      {/* Usuario y botón de salir */}
      <Box mt={4}>
        <HStack spacing={3} align="center" mb={2}>
          <Avatar size="sm" name={user?.name} />
          <Box>
            <Text fontWeight="bold" color="white">
              {user?.name} {user?.lastName}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              {user?.email}
            </Text>
          </Box>
        </HStack>

        <Button
          leftIcon={<Icon as={LogOut} />}
          variant="ghost"
          colorScheme="whiteAlpha"
          w="full"
          onClick={handleLogout}
          justifyContent="flex-start"
        >
          Cerrar sesión
        </Button>
      </Box>
    </Flex>
  );
};

const NavItem = ({ to, icon, label, onClick }) => (
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
    onClick={onClick}
  >
    <Box as={icon} size="18px" />
    <Text fontSize="sm">{label}</Text>
  </Link>
);

const SubNavItem = ({ to, icon, label, onClick }) => (
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
    onClick={onClick}
  >
    <Box as={icon} size="16px" />
    {label}
  </Link>
);


export default SidebarContent;

