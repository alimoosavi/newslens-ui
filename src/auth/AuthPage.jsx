import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/token/", { username, password });
      const accessToken = response.data.access;

      localStorage.setItem("access_token", accessToken);
      navigate("/"); // Redirect to main layout
    } catch (error) {
      console.error(error);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
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
          width: 360,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#1c1d21",
          color: "#e5e5e5",
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          NewsLens Login
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{
            input: { color: "#fff" },
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
          fullWidth
          sx={{
            input: { color: "#fff" },
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
            mt: 1,
            backgroundColor: "#10a37f",
            "&:hover": { backgroundColor: "#0e8f6e" },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Paper>
    </Box>
  );
}
