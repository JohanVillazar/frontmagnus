import { Box, VStack, Image, Text, HStack, Tag, TagLabel, Badge } from "@chakra-ui/react";

const ProductCard = ({ product, onClick }) => (
  <Box
    p={3}
    borderWidth={1}
    borderRadius="md"
    bg="white"
    _hover={{ boxShadow: "md", cursor: "pointer" }}
    onClick={() => onClick(product)}
  >
    <VStack align="start" spacing={1}>
      {product.image ? (
        <Image src={product.image} alt={product.label} boxSize="80px" />
      ) : (
        <Box boxSize="80px" bg="gray.100" />
      )}
      <Text fontWeight="bold">{product.label}</Text>
      <HStack justify="space-between" w="full">
        <Tag colorScheme="green" size="sm">
          <TagLabel>${product.priceperUnit}</TagLabel>
        </Tag>
        {product.totalunitstock > 0 ? (
          <Text fontSize="xs" color="gray.500">Stock: {product.totalunitstock}</Text>
        ) : (
          <Badge colorScheme="red" fontSize="xs" variant="subtle">Agotado</Badge>
        )}
      </HStack>
    </VStack>
  </Box>
);

export default ProductCard;
