import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Dark theme similar to ChatGPT
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#10a37f" },       // ChatGPT green accent
    secondary: { main: "#888" },
    background: { default: "#0b0c0f", paper: "#1c1d21" },
    text: { primary: "#e5e5e5", secondary: "#aaa" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
