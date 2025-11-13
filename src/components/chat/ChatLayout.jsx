import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";
import ChatWindow from "./ChatWindow";
import SessionsNavbar from "./SessionsNavbar";
import SearchTab from "./SearchTab";


export default function ChatLayout() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [tab, setTab] = useState(0); // 0 = Chat, 1 = Search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await api.get(API_ENDPOINTS.SESSIONS);
      
      // Handle paginated response
      const sessionsData = res.data.results || res.data;
      const sessionsList = Array.isArray(sessionsData) ? sessionsData : [];
      
      // Sort by updated_at (newest first)
      const sortedSessions = sessionsList.sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      );
      
      setSessions(sortedSessions);
      
      console.log("✅ Fetched sessions:", sortedSessions);
    } catch (err) {
      console.error("❌ Failed to fetch sessions:", err);
      
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Failed to load sessions. Please refresh the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Tab Switcher */}
      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          bgcolor: "#111",
          color: "#fff",
          borderBottom: "1px solid #333",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            minHeight: 56,
          },
        }}
      >
        <Tab label="💬 Chat" />
        <Tab label="🔍 Search" />
      </Tabs>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ m: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {loading ? (
          // Loading State
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#0b0c0f",
            }}
          >
            <CircularProgress size={40} sx={{ color: "#10a37f" }} />
          </Box>
        ) : tab === 0 ? (
          // Chat Mode
          <>
            <SessionsNavbar
              sessions={sessions}
              setSessions={setSessions}
              activeSession={activeSession}
              onSelectSession={setActiveSession}
              onLogout={handleLogout}
              onRefresh={fetchSessions}
            />
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <ChatWindow
                activeSession={activeSession}
                setActiveSession={setActiveSession}
                sessions={sessions}
                setSessions={setSessions}
              />
            </Box>
          </>
        ) : (
          // Search Mode
          <SearchTab />
        )}
      </Box>
    </Box>
  );
}
