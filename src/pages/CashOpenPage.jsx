import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  useToast,
  Divider,
  Center,
  Spinner,
} from "@chakra-ui/react";


import CashOpenForm from "../components/CashOpenForm";
import CashProductEntryPanel from "../components/CashProductEntryPanel";
import CashProductDamagePanel from "../components/CashProductDamagePanel";
import CashIncomePanel from "../components/CashIncomePanel";
import CashExpensePanel from "../components/CashExpensePanel";

const CashOpenPage = () => {
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCashStatus = async () => {
      try {
        const res = await fetch("https://backmagnus-production.up.railway.app/api/cash/status", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        
        if (res.ok && data.isOpen && data.cashRegisterId) {
          setIsCashOpen(true);
          localStorage.setItem("cashRegisterId", data.cashRegisterId);
        } else {
          setIsCashOpen(false);
        }
      } catch (err) {
        console.error("Error verificando estado de caja:", err);
        toast({
          title: "Error",
          description: "No se pudo verificar el estado de la caja.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCashStatus();
  }, [toast]);

  const handleCajaAbierta = () => {
    setIsCashOpen(true);
  };

  return (
    <Box ml="250px" p={6}>
      <Heading size="lg" mb={4}>Gestión de Caja</Heading>
      <Divider mb={4} />

      {loading ? (
        <Center py={10}>
          <Spinner size="xl" />
        </Center>
      ) : !isCashOpen ? (
        <Center>
          <CashOpenForm onSuccess={handleCajaAbierta} />
        </Center>
      ) : (
        <>
          <Heading size="md" mb={4}>Registrar movimientos durante el turno de caja</Heading>
          <SimpleGrid minChildWidth="320px" spacing={6} mb={6}>
  <CashProductEntryPanel /> 
  <CashProductDamagePanel />
  <CashIncomePanel />
  <CashExpensePanel />
</SimpleGrid>
        
        </>
      )}
    </Box>
  );
};

export default CashOpenPage;