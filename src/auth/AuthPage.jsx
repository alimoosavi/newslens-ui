import React, { useState } from "react";
import api from "../api"; // axios instance
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/token/", { username, password });
      const accessToken = response.data.access;
      localStorage.setItem("access_token", accessToken); // Save token
      navigate("/"); // Redirect to main page
    } catch (error) {
      console.error(error);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
