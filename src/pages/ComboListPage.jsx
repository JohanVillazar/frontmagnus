// src/pages/ComboListPage.jsx
import { Box } from "@chakra-ui/react";
import ComboList from "../components/ComboList";

const ComboListPage = () => (
  <Box ml={{ base: 0, md: "250px" }} p={6}>
    <ComboList />
  </Box>
);

export default ComboListPage;
