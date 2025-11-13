import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/token/", { username, password });
      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Store user info
      const userInfo = {
        username: response.data.username,
        user_id: response.data.user_id,
      };
      localStorage.setItem("user", JSON.stringify(userInfo));

      navigate("/"); // Redirect to main layout
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register/", {
        username,
        email,  // ✅ Now sending email
        password,
      });

      setSuccess(
        "Registration successful! You can now log in with your credentials."
      );
      
      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setTab(0);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data) {
        // Handle field-specific errors
        const errors = err.response.data;
        if (errors.username) {
          setError(`Username: ${errors.username[0]}`);
        } else if (errors.email) {
          setError(`Email: ${errors.email[0]}`);
        } else if (errors.password) {
          setError(`Password: ${errors.password[0]}`);
        } else if (errors.detail) {
          setError(errors.detail);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
    setSuccess("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (tab === 0) {
        handleLogin();
      } else {
        handleRegister();
      }
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
        {/* App Title */}
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 2, fontWeight: "bold", color: "#10a37f" }}
        >
          NewsLens
        </Typography>

        {/* Tab Switcher */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#10a37f",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#10a37f",
            },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 1 }}>
            {success}
          </Alert>
        )}

        {/* Login Form */}
        {tab === 0 && (
          <>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              autoFocus
              sx={{
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#10a37f" },
                  "&.Mui-focused fieldset": { borderColor: "#10a37f" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#10a37f" },
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              sx={{
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#10a37f" },
                  "&.Mui-focused fieldset": { borderColor: "#10a37f" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#10a37f" },
              }}
            />

            <Button
              variant="contained"
              onClick={handleLogin}
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                backgroundColor: "#10a37f",
                fontWeight: "bold",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#0e8f6e" },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </>
        )}

        {/* Register Form */}
        {tab === 1 && (
          <>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              autoFocus
              helperText="At least 3 characters"
              sx={{
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#10a37f" },
                  "&.Mui-focused fieldset": { borderColor: "#10a37f" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#10a37f" },
                "& .MuiFormHelperText-root": { color: "#666" },
              }}
            />

            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              helperText="Required for account recovery"
              sx={{
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#10a37f" },
                  "&.Mui-focused fieldset": { borderColor: "#10a37f" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#10a37f" },
                "& .MuiFormHelperText-root": { color: "#666" },
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              helperText="At least 8 characters"
              sx={{
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#10a37f" },
                  "&.Mui-focused fieldset": { borderColor: "#10a37f" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#10a37f" },
                "& .MuiFormHelperText-root": { color: "#666" },
              }}
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              sx={{
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#10a37f" },
                  "&.Mui-focused fieldset": { borderColor: "#10a37f" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#10a37f" },
              }}
            />

            <Button
              variant="contained"
              onClick={handleRegister}
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                backgroundColor: "#10a37f",
                fontWeight: "bold",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#0e8f6e" },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </>
        )}

        {/* Footer Text */}
        <Typography
          variant="caption"
          align="center"
          sx={{ color: "#666", mt: 2 }}
        >
          {tab === 0
            ? "Don't have an account? Click Register above."
            : "Already have an account? Click Login above."}
        </Typography>
      </Paper>
    </Box>
  );
}
