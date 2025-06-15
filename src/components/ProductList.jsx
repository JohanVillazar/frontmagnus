import {
  Box,
  Text,
  Spinner,
  Badge,
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  SimpleGrid,
  VStack,
  HStack,
  Divider,
  Flex,
  Heading
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();
  const cancelRef = useRef();

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/variant/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDeleteVariant = async () => {
    if (!variantToDelete) return;

    setIsDeleting(true);
    try {
      await fetch(`https://backmagnus-production.up.railway.app/api/variants/${variantToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast({ title: "Variante eliminada", status: "success" });
      fetchProducts();
    } catch (err) {
      toast({ title: "Error al eliminar", status: "error" });
    } finally {
      setIsDeleting(false);
      setVariantToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box p={6} ml="250px">
        <Spinner size="lg" />
        <Text ml={4} display="inline">Cargando productos...</Text>
      </Box>
    );
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={6} ml={{ base: "0", md: "250px" }}>
      <Heading as="h1" size="xl" mb={2}>Inventario General</Heading>
      <input
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <Text fontSize="lg" mb={6} color="gray.600">Gestiona tu catálogo de productos y niveles de stock</Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {filteredProducts.map((product) => (
          <Box
            key={product.productId}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          >
            <Heading as="h2" size="md" mb={2}>{product.name}</Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>{product.description}</Text>
            <Divider my={3} />

            {product.variants.map((variant) => (
              <Box key={variant.id} mb={4} pb={3} borderBottom="1px" borderColor="gray.100">
                <Flex justify="space-between" mb={1}>
                  <Text fontWeight="semibold">{variant.vatiantName}</Text>
                  <Badge 
                    colorScheme={variant.totalunitstock > 10 ? "green" : "orange"}
                    variant="subtle"
                  >
                    {variant.totalunitstock > 10 ? "OK" : "Stock Bajo"}
                  </Badge>
                </Flex>
                
                <Text fontSize="sm" color="gray.500" mb={1}>
                  <strong>Medida:</strong> {variant.baseunit}
                </Text>
                
                <Text fontSize="sm" mb={1}>
                  <strong>Stock:</strong> {variant.totalunitstock}
                </Text>
                
                <Text fontSize="sm">
                  <strong>Precio:</strong> ${parseFloat(variant.priceperUnit).toFixed(2)}
                </Text>
                
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  mt={2}
                  width="full"
                  onClick={() => setVariantToDelete(variant.id)}
                >
                  Eliminar
                </Button>
              </Box>
            ))}
          </Box>
        ))}
      </SimpleGrid>

      {/* Modal de confirmación */}
      <AlertDialog
        isOpen={!!variantToDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setVariantToDelete(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Eliminar Variante</AlertDialogHeader>
            <AlertDialogBody>¿Estás seguro? Esta acción no se puede deshacer.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setVariantToDelete(null)}>Cancelar</Button>
              <Button colorScheme="red" onClick={confirmDeleteVariant} ml={3} isLoading={isDeleting}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductList;

