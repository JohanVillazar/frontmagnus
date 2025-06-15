import { Box, Heading } from "@chakra-ui/react";
import CreateSupplierForm from "../components/CreateSupplierForm";

const SupplierPage = () => {
  return (
    <Box ml="250px" p={6}>
      <Heading mb={6}>Registrar Nuevo Proveedor</Heading>
      <CreateSupplierForm />
    </Box>
  );
};

export default SupplierPage;
