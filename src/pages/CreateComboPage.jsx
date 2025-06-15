import { Box } from "@chakra-ui/react";
import ComboCreateForm from "../components/ComboCreateForm";

const CreateComboPage = () => (
  <Box ml={{ base: 0, md: "250px" }} p={6}>
    <ComboCreateForm />
  </Box>
);

export default CreateComboPage;