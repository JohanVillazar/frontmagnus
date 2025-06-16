import { Box, Heading } from "@chakra-ui/react";
import CreateSupplierForm from "../components/CreateSupplierForm";

const SupplierPage = () => {
  return (
    <Box p={{ base: 4, md: 8 }}>
      <Heading mb={6}>Registrar Nuevo Proveedor</Heading>
      <CreateSupplierForm />
    </Box>
  );
};

export default SupplierPage;
