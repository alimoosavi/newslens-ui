import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(API_ENDPOINTS.AUTH_TOKEN, {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem("access_token", access);
      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }

      // Redirect to main layout
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0b0c0f",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#1c1d21",
          color: "#e5e5e5",
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
          NewsLens
        </Typography>

        <Typography variant="body2" align="center" sx={{ mb: 2, color: "#888" }}>
          Sign in to continue
        </Typography>

        <Collapse in={!!error}>
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          fullWidth
          autoComplete="username"
          sx={{
            input: { color: "#fff" },
            label: { color: "#888" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#10a37f" },
              "&.Mui-focused fieldset": { borderColor: "#10a37f" },
            },
          }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          fullWidth
          autoComplete="current-password"
          sx={{
            input: { color: "#fff" },
            label: { color: "#888" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#10a37f" },
              "&.Mui-focused fieldset": { borderColor: "#10a37f" },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            backgroundColor: "#10a37f",
            "&:hover": { backgroundColor: "#0e8f6e" },
            "&:disabled": { backgroundColor: "#444", color: "#888" },
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign In"
          )}
        </Button>

        <Typography variant="caption" align="center" sx={{ mt: 2, color: "#666" }}>
          NewsLens AI-Powered News Assistant
        </Typography>
      </Paper>
    </Box>
  );
}
