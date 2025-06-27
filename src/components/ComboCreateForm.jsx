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
import CategoryFormModal from "./CategoryFormModal"; // Ajusta la ruta si es distinta
import { useDisclosure } from "@chakra-ui/react";


const ComboCreateForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [components, setComponents] = useState([]);
  const toast = useToast();

  const {
    isOpen: isCategoryModalOpen,
    onOpen: openCategoryModal,
    onClose: closeCategoryModal,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [variantsRes, categoriesRes] = await Promise.all([
          fetch("https://backmagnus-production.up.railway.app/api/variant/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("https://backmagnus-production.up.railway.app/api/category/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const variantsData = await variantsRes.json();
        const categoriesData = await categoriesRes.json();

        const flattened = variantsData.flatMap((product) =>
          product.variants.map((variant) => ({
            id: variant.id,
            Product: { name: product.description },
            vatiantName: variant.vatiantName,
          }))
        );

        setAllVariants(flattened);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
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
          categoryId,
          componentes: components,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear combo");

      toast({ title: "Combo creado exitosamente", status: "success" });
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setComponents([]);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  return (
    <Box maxW="700px" mx="auto" mt={10} p={8} bg="white" borderRadius="md" boxShadow="lg">
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
        <FormControl isRequired>
          <FormLabel>Categoría</FormLabel>
          <HStack spacing={2}>
            <Select
              placeholder="Selecciona una categoría"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <IconButton
              icon={<AddIcon />}
              colorScheme="blue"
              aria-label="Agregar categoría"
              onClick={openCategoryModal}
            />
          </HStack>
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
              onChange={(val) =>
                updateComponent(idx, "quantity", parseInt(val) || 1)
              }
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
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onCategoryCreated={(newCategory) => {
          setCategories((prev) => [...prev, newCategory]);
          setCategoryId(newCategory.id); // seleccionar automáticamente la nueva
        }}
      />
    </Box>
  );
};

export default ComboCreateForm;
