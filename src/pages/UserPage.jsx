import {
  Box,
  Heading,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Badge,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateUserForm from "../components/CreateUserForm";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "purple";
      case "cajero":
        return "blue";
      case "user":
      default:
        return "gray";
    }
  };

  return (
    <Box ml="250px" p={6}>
      <Heading mb={6}>Crear usuarios del sistema</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <CreateUserForm onSuccess={fetchUsers} />
        </Box>

        <Box bg="white" p={4} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>
            Usuarios Registrados
          </Heading>

          {loading ? (
            <Spinner />
          ) : users.length === 0 ? (
            <Text color="gray.500">No hay usuarios registrados</Text>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead bg={useColorModeValue("gray.100", "gray.700")}>
                  <Tr>
                    <Th>Nombre</Th>
                    <Th>Email</Th>
                    <Th>Teléfono</Th>
                    <Th textAlign="center">Rol</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((u) => (
                    <Tr key={u.id} _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}>
                      <Td>{u.name} {u.lastName}</Td>
                      <Td>{u.email}</Td>
                      <Td>{u.phone}</Td>
                      <Td textAlign="center">
                        <Badge colorScheme={getRoleColor(u.role)}>{u.role}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default UserPage;

