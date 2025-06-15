import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  Badge,
  Spinner,
  Grid,
  Input,
} from "@chakra-ui/react";

const ComboList = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/combo/items", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setCombos(data);
      } catch (err) {
        console.error("Error al cargar combos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const filteredCombos = combos.filter(
    (combo) =>
      combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Spinner size="lg" />;

  return (
    <Box p={{ base: 2, md: 4 }} w="full">
      <Heading size="lg" mb={4} textAlign="center">
        Lista de Recetas
      </Heading>

      <Input
        placeholder="Buscar"
        mb={4}
        border="1px solid"
        borderColor="gray.300"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap={{ base: 4, md: 6 }}
        px={{ base: 1, md: 4 }}
        w="full"
        maxW="100%"
      >
        {filteredCombos.map((combo) => (
          <Box
            key={combo.id}
            p={3}
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid #E2E8F0"
            minH="210px"
            transition="all 0.2s ease-in-out"
            _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
          >
            <Text fontSize="md" fontWeight="semibold" mb={1}>
              {combo.name}
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
              {combo.description}
            </Text>

            <Badge colorScheme="purple" fontSize="0.75rem" mb={2}>
              ${parseFloat(combo.price).toLocaleString()}
            </Badge>

            <Text fontWeight="medium" fontSize="sm" mb={1}>Ingredientes:</Text>
            <VStack align="start" spacing={0.5}>
              {combo.components.map((c, idx) => (
                <Text key={idx} fontSize="xs" color="gray.700">
                  {c.quantity} x {c.component?.variantName} - {c.component?.Product?.name || "Producto"}
                </Text>
              ))}
            </VStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default ComboList;

