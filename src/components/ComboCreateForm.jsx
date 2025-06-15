import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  NumberInput,
  NumberInputField,
  Heading,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const ComboCreateForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [allVariants, setAllVariants] = useState([]);
  const [components, setComponents] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/variant/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        const flattened = data.flatMap((product) =>
          product.variants.map((variant) => ({
            id: variant.id,
            Product: { name: product.description },
            vatiantName: variant.vatiantName,
          }))
        );

        setAllVariants(flattened);
      } catch (err) {
        console.error("Error cargando variantes:", err);
      }
    };

    fetchVariants();
  }, []);

  const addComponent = () => {
    setComponents([...components, { variantId: "", quantity: 1 }]);
  };

  const updateComponent = (index, field, value) => {
    const updated = [...components];
    updated[index][field] = value;
    setComponents(updated);
  };

  const removeComponent = (index) => {
    const updated = [...components];
    updated.splice(index, 1);
    setComponents(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://backmagnus-production.up.railway.app/api/combo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          componentes: components,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear combo");

      toast({ title: "Combo creado exitosamente", status: "success" });
      setName("");
      setDescription("");
      setPrice("");
      setComponents([]);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={10} p={8} bg="white" borderRadius="md" boxShadow="lg">
  <Heading size="lg" mb={6} textAlign="center">
    Crear Receta
  </Heading>

  <VStack spacing={4} align="stretch">
    <FormControl isRequired>
      <FormLabel>Nombre</FormLabel>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Arepa típica rellena"
      />
    </FormControl>

    <FormControl isRequired>
      <FormLabel>Descripción</FormLabel>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ej: Arepa de maíz con pollo desmechado y guacamole"
      />
    </FormControl>

    <FormControl isRequired>
      <FormLabel>Precio</FormLabel>
      <Input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Ej: 12000"
      />
    </FormControl>

    <Button
      leftIcon={<AddIcon />}
      onClick={addComponent}
      colorScheme="teal"
      variant="solid"
      w="full"
    >
      Agregar ingrediente
    </Button>

    {components.map((comp, idx) => (
      <HStack key={idx} spacing={4} align="center">
        <Select
          placeholder="Selecciona un ingrediente"
          value={comp.variantId}
          onChange={(e) => updateComponent(idx, "variantId", e.target.value)}
          flex="1"
        >
          {allVariants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.Product?.name} - {v.vatiantName}
            </option>
          ))}
        </Select>

        <NumberInput
          min={1}
          value={comp.quantity}
          onChange={(val) => updateComponent(idx, "quantity", parseInt(val) || 1)}
          maxW="100px"
        >
          <NumberInputField placeholder="Cant." />
        </NumberInput>

        <IconButton
          aria-label="Eliminar"
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={() => removeComponent(idx)}
        />
      </HStack>
    ))}

    <Button colorScheme="blue" onClick={handleSubmit} w="full">
      Crear receta
    </Button>
  </VStack>
</Box>

   
  );
};

export default ComboCreateForm;
