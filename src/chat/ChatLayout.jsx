import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ChatWindow from "./ChatWindow";
import ChatSidebar from "./ChatSidebar";
import SearchTab from "./SearchTab";

export default function ChatLayout() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [tab, setTab] = useState(0); // 0 = Chat, 1 = Search
  const navigate = useNavigate();

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/api/sessions/");
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };
    fetchSessions();
  }, []);

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
            minHeight: 48,
          },
          "& .Mui-selected": {
            color: "#10a37f",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#10a37f",
          },
        }}
      >
        <Tab label="Chat" />
        <Tab label="Search" />
      </Tabs>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {tab === 0 ? (
          // Chat Mode
          <>
            <ChatSidebar
              sessions={sessions}
              setSessions={setSessions}
              activeSession={activeSession}
              onSelectSession={(session) => setActiveSession(session)}
              onLogout={handleLogout}
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
