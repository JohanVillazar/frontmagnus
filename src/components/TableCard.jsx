import { Box, Text, Badge, Icon } from "@chakra-ui/react";
import { FaChair, FaClock, FaHome } from "react-icons/fa";

const statusColor = {
  disponible: "green",
  ocupada: "red",
  reservada: "yellow",
};

const bgColor = {
  disponible: "green.50",
  ocupada: "red.50",
  reservada: "yellow.50",
};

const TableCard = ({ table, onClick }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={bgColor[table.status] || "gray.50"}
      boxShadow="sm"
      transition="0.2s"
      _hover={{ boxShadow: "md", transform: "scale(1.02)", cursor: "pointer" }}
      onClick={() => onClick?.(table)}
    >
      <Text fontWeight="bold" mb={2}>
        Mesa {table.number}
      </Text>

      <Text fontSize="sm" mb={2}>
        <Icon as={FaChair} mr={2} />
        Asientos: {table.seats || "N/A"}
      </Text>

      <Text fontSize="sm" mb={2}>
        <Icon as={FaHome} mr={2} />
        Ubicacion: {table.location || "N/A"}
      </Text>

      {table.time && (
        <Text fontSize="sm" mb={2}>
          <Icon as={FaClock} mr={2} />
          {table.time}
        </Text>
      )}

      <Badge colorScheme={statusColor[table.status]}>
        {table.status.toUpperCase()}
      </Badge>
    </Box>
  );
};

export default TableCard;


