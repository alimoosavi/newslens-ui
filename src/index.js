import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Resets browser CSS and applies MUI styling */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
