import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  FormErrorMessage,
  FormHelperText,
  Select,
} from "@chakra-ui/react";

const emptyVariant = {
  vatiantName: "",
  amountVariant: "",
  amountinVariant: "",
  unitmeasureVariant: "",
  baseunit: "",
  priceperUnit: "",
};

const ProductVariantsManager = ({ productId }) => {
  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [unitMeasureOptions, setUnitMeasureOptions] = useState([]);
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  const toast = useToast();

useEffect(() => {
  fetch("https://backmagnus-production.up.railway.app/api/variant/units", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then((res) => res.json())
    .then((data) => {
      setUnitMeasureOptions(data.unitMeasureOptions || []);
      setBaseUnitOptions(data.baseUnitOptions || []);
    })
    .catch((error) => {
      toast({
        title: "Error al cargar unidades",
        description: error.message,
        status: "error",
      });
    });
}, []);


  const handleChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { ...emptyVariant }]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const handleSubmit = async () => {
    try {
      for (const variant of variants) {
        const payload = {
          ...variant,
          productId,
        };

        const res = await fetch("https://backmagnus-production.up.railway.app/api/variant/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al crear variante");
      }

      toast({
        title: "Variantes registradas",
        status: "success",
      });

      setVariants([{ ...emptyVariant }]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Box mt={8}>
      <VStack spacing={6} align="stretch">
        {variants.map((variant, index) => (
          <Box
            key={index}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            bg="gray.50"
          >
            <HStack spacing={4} wrap="wrap">
              <FormControl isRequired isInvalid={!variant.vatiantName}>
                <FormLabel>Tipo de presentación</FormLabel>
                <Input
                  placeholder="Ej: Unidades, canasta, paquete, caja"
                  value={variant.vatiantName}
                  onChange={(e) =>
                    handleChange(index, "vatiantName", e.target.value)
                  }
                />
                {!variant.vatiantName && (
                  <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!variant.amountVariant}>
                <FormLabel>Cantidad por presentación</FormLabel>
                <Input
                  type="number"
                  placeholder="Ej: 10"
                  value={variant.amountVariant}
                  onChange={(e) =>
                    handleChange(index, "amountVariant", e.target.value)
                  }
                />
                <FormHelperText>
                  Indica la cantidad total de caja y/o empaques
                </FormHelperText>
                <FormHelperText>
                  Si la presentación es Unidad este campo se deja en 1.
                </FormHelperText>
                {!variant.amountVariant && (
                  <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!variant.amountinVariant}>
                <FormLabel>Unidades dentro de la presentación</FormLabel>
                <Input
                  type="number"
                  placeholder="Ej: 20"
                  value={variant.amountinVariant}
                  onChange={(e) =>
                    handleChange(index, "amountinVariant", e.target.value)
                  }
                />
                <FormHelperText>
                  Número de unidades dentro del empaque
                </FormHelperText>
                {!variant.amountinVariant && (
                  <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!variant.unitmeasureVariant}>
                <FormLabel>Unidad de medida</FormLabel>
                <Select
                  placeholder="Seleccione unidad"
                  value={variant.unitmeasureVariant}
                  onChange={(e) =>
                    handleChange(index, "unitmeasureVariant", e.target.value)
                  }
                >
                  {unitMeasureOptions.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {!variant.unitmeasureVariant && (
                  <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!variant.baseunit}>
                <FormLabel>Unidad base</FormLabel>
                <Select
                  placeholder="Seleccione unidad base"
                  value={variant.baseunit}
                  onChange={(e) =>
                    handleChange(index, "baseunit", e.target.value)
                  }
                >
                  {baseUnitOptions.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {!variant.baseunit && (
                  <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!variant.priceperUnit}>
                <FormLabel>Precio por unidad</FormLabel>
                <Input
                  type="number"
                  placeholder="Ej: 1500"
                  value={variant.priceperUnit}
                  onChange={(e) =>
                    handleChange(index, "priceperUnit", e.target.value)
                  }
                />
                <FormHelperText>
                  Precio individual según unidad base
                </FormHelperText>
                {!variant.priceperUnit && (
                  <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
                )}
              </FormControl>
            </HStack>

            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              mt={3}
              onClick={() => removeVariant(index)}
              isDisabled={variants.length === 1}
            >
              Eliminar variante
            </Button>
          </Box>
        ))}

        <HStack>
          <Button onClick={addVariant} colorScheme="blue" variant="outline">
            + Agregar otra variante
          </Button>
          <Button onClick={handleSubmit} colorScheme="green">
            Guardar variantes
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProductVariantsManager;
