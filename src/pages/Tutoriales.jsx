import React from "react";
import ReactPlayer from "react-player/youtube";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
} from "@chakra-ui/react";

const videos = [
  { title: "1. Inicio de Sesión", url: "https://www.youtube.com/watch?v=QorybWsJPkg" },
  { title: "2. Tablero Principal", url: "https://www.youtube.com/watch?v=C-HrG73kGOg" },
  { title: "3. Menú Lateral", url: "https://www.youtube.com/watch?v=LlmJVIx94yM" },
  { title: "4. Crear Productos", url: "https://www.youtube.com/watch?v=D2nkNNrs3NM" },
  { title: "5. Crear Recetas", url: "https://www.youtube.com/watch?v=wj5VO8NMl5s" },
  { title: "6. Apertura de Caja", url: "https://www.youtube.com/watch?v=AkwjSLFtn_c" },
  { title: "7. Gestión de Caja", url: "https://www.youtube.com/watch?v=PzvWWryNszA" },
  { title: "8. Mesas y Ventas", url: "https://www.youtube.com/watch?v=6Gbzyj7J0p8" },
];

const Tutoriales = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("md", "dark-lg");

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <Heading as="h1" size="lg" mb={6} textAlign="center">
        Tutoriales de uso del sistema
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {videos.map((video, index) => (
          <Card key={index} bg={cardBg} boxShadow={cardShadow} borderRadius="lg" overflow="hidden">
            <CardBody>
              <Text fontWeight="bold" fontSize="md" mb={2}>
                {video.title}
              </Text>
              <Box
                position="relative"
                paddingTop="56.25%" // 16:9 aspect ratio
                borderRadius="md"
                overflow="hidden"
              >
                <Box position="absolute" top={0} left={0} w="100%" h="100%">
                  <ReactPlayer url={video.url} controls width="100%" height="100%" />
                </Box>
              </Box>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Tutoriales;

