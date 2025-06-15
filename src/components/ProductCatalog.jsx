// components/ProductCatalog.jsx
import {
    Box,
    Input,
    SimpleGrid,
    Tag,
    TagLabel,
    Image,
    Text,
    VStack,
    HStack,
    Spinner,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  
  const ProductCatalog = ({ onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
  
    useEffect(() => {

      const fetchProducts = async () => {
        try {
          const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/products", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await res.json();
    
          // Validación por si el backend responde mal
          if (!Array.isArray(data)) {
            console.error("Respuesta inesperada del backend:", data);
            setProducts([]);
            setFiltered([]);
            return;
          }
    
          const flat = data
          .filter(item => item.productVariant && item.finalQuantity > 0)
          .map((item) => ({
            id: item.productVariant.id,
            name: `${item.productVariant.Product?.name || "Sin nombre"} - ${item.productVariant.vatiantName || "Variante"}`,
            price: parseFloat(item.productVariant.priceperUnit) || 0,
            stock: item.finalQuantity,
            image: "",
          }));
    
          setProducts(flat);
          setFiltered(flat);
        } catch (err) {
          console.error("Error cargando productos", err);
        }
      };

      fetchProducts();
    }, []);
  
    useEffect(() => {
      const q = search.toLowerCase();
      const result = products.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
      setFiltered(result);
    }, [search, products]);
  
    return (
      <Box>
        <Input
          placeholder="Buscar producto..."
          mb={4}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
  
        {!products.length ? (
          <Spinner />
        ) : (
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
            {filtered.map((p) => (
              <Box
                key={p.id}
                p={3}
                borderWidth={1}
                borderRadius="md"
                bg="white"
                _hover={{ boxShadow: "md", cursor: "pointer" }}
                onClick={() => onSelectProduct(p)}
              >
                <VStack align="start" spacing={1}>
                  {p.image ? (
                    <Image src={p.image} alt={p.name} boxSize="80px" />
                  ) : (
                    <Box boxSize="80px" bg="gray.100" />
                  )}
                  <Text fontWeight="bold">{p.name}</Text>
                  <HStack justify="space-between" w="full">
                    <Tag colorScheme="green" size="sm">
                      <TagLabel>${p.price}</TagLabel>
                    </Tag>

                    {p.stock > 0 ? (
                      <Text fontSize="xs" color="gray.500">
                        Stock: {p.stock}
                      </Text>
                    ) : (
                      <Badge colorScheme="red" fontSize="xs" variant="subtle">
                        Agotado
                      </Badge>
                    )}
                  </HStack>
                 
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    );
  };
  
  export default ProductCatalog;
  