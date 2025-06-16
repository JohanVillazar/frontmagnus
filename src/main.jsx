import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SessionExpiredProvider } from "./context/SessionExpiredContext";
import App from './App.jsx';
import theme from './/../theme.js';
import '@fontsource/roboto/400.css'; // Regular
import '@fontsource/roboto/700.css'; // Bold


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <SessionExpiredProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SessionExpiredProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);