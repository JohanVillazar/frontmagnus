import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,useDisclosure,Drawer,DrawerContent,IconButton,Text} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import ProductCreatePage from "./components/ProductCreatePage";
import ProductList from "./components/ProductList";
import CashOpenPage from "./pages/CashOpenPage";
import SalesPage from "./pages/SalesPage";
import CashClosePage from "./pages/CashClosePage";
import TablesPage from './pages/TablesPage';
import CreatePurchase from "./components/CreatePurchase";
import ReserveTableModal from "./components/ReserveTableModal";
import SupplierPage from "./pages/SupplierPage";
import UserPage from "./pages/UserPage";
import ComboListPage from "./pages/ComboListPage";
import CreateComboPage from "./pages/CreateComboPage";
import RegisterForm from "./pages/RegisterForm";
import SidebarContent from "./components/SidebarContent";

import { AuthProvider, useAuth } from './context/AuthContext';
import { SessionExpiredProvider, useSessionExpired } from './context/SessionExpiredContext';
import { setupFetchInterceptor } from './utils/fetchInterceptor';

function SessionExpiredModal() {
  const { isExpired, resetSessionExpired } = useSessionExpired();
  const { logout } = useAuth();

  const handleClose = () => {
    resetSessionExpired();
    logout();
    window.location.href = "/";
  };

  return (
    <Modal isOpen={isExpired} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sesión expirada</ModalHeader>
        <ModalBody>
          Tu sesión ha caducado. Por favor, Ingresa de nuevo al Sistema.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="orange" onClick={handleClose}>
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


function AppContent() {
  const { isLoading } = useAuth();
 const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hideSidebar = location.pathname === "/" || location.pathname === "/register";
  

    if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text fontWeight="bold" color="purple.600">Cargando usuario...</Text>
      </Box>
    );
  }

  return (
  <Box minH="100vh">
    {/* Sidebar fijo para desktop */}
    {!hideSidebar && (
      <Box
        as="aside"
        w="250px"
        h="100vh"
        position="fixed"
        top="0"
        left="0"
        display={{ base: "none", md: "block" }}
        zIndex="100"
        bg="#62189e"
        color="white"
      >
        <SidebarContent />
      </Box>
    )}

    {/* Drawer para móviles */}
    {!hideSidebar && (
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    )}

    {/* Contenido principal */}
    <Box
      ml={{ base: 0, md: hideSidebar ? 0 : "250px" }}
      p={4}
      transition="margin-left 0.3s"
    >
      {/* Botón de menú solo en mobile */}
      {!hideSidebar && (
        <Box mb={4} display={{ base: "block", md: "none" }}>
          <IconButton
            icon={<FiMenu />}
            onClick={onOpen}
            variant="outline"
            colorScheme="purple"
            aria-label="Abrir menú"
          />
        </Box>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos/nuevo" element={<ProductCreatePage />} />
        <Route path="/listar" element={<ProductList />} />
        <Route path="/caja/abrir" element={<CashOpenPage />} />
        <Route path="/caja/cerrar" element={<CashClosePage />} />
        <Route path="/ventas" element={<SalesPage />} />
        <Route path="/mesas" element={<TablesPage />} />
        <Route path="/reservar-mesa" element={<ReserveTableModal />} />
        <Route path="/compras/nueva" element={<CreatePurchase />} />
        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/combos" element={<ComboListPage />} />
        <Route path="/combos/nuevo" element={<CreateComboPage />} />
      </Routes>

      <SessionExpiredModal />
    </Box>
  </Box>
);
} 



function InterceptorWrapper() {
  const { triggerSessionExpired } = useSessionExpired();

  useEffect(() => {
    setupFetchInterceptor(triggerSessionExpired);
  }, [triggerSessionExpired]);

  return <AppContent />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SessionExpiredProvider>
          <InterceptorWrapper />
        </SessionExpiredProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

