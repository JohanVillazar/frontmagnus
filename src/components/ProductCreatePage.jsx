import { useState } from "react";
import {
  Box,
  Heading,
  Divider,
  Grid
} from "@chakra-ui/react";
import CreateProductForm from "../components/CreateProductForm";
import ProductVariantsManager from "../components/ProductVariantsManager";

const ProductCreatePage = () => {
  const [productId, setProductId] = useState(null);

  return (
    <Box maxW="800px" mx="auto" bg="white" p={6} rounded="lg" boxShadow="md">
  <Heading mb={6} size="lg" textAlign="center">
    Crear nuevo producto 
  </Heading>

  {/* FORMULARIO CENTRADO */}
  <Box maxW="600px" mx="auto">
    <CreateProductForm onSuccess={(id) => setProductId(id)} />
  </Box>

  {/* VARIANTES */}
  {productId && (
    <>
      <Divider my={8} />
      <Heading size="md" mb={4}>
        
      </Heading>
      <Box maxW="500px" mx="auto">
  <ProductVariantsManager productId={productId} />
</Box>

    </>
  )}
</Box>


  );
};

export default ProductCreatePage;

