import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import ChatWindow from "./ChatWindow";
import SessionsNavbar from "./SessionsNavbar";
import SearchTab from "./SearchTab";

export default function ChatLayout() {
  const [sessions, setSessions] = useState([]); // ✅ Initialize as empty array
  const [activeSession, setActiveSession] = useState(null);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/api/sessions/");
        // ✅ Handle both array and paginated responses
        const sessionData = Array.isArray(res.data) ? res.data : res.data.results || [];
        setSessions(sessionData);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setSessions([]); // ✅ Ensure it's always an array
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top Tab Switcher */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            bgcolor: "#111",
            color: "#fff",
            borderBottom: "1px solid #2a2a2a",
            minHeight: 56,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: 56,
              transition: "all 0.2s",
              "&:hover": {
                color: "#10a37f",
                bgcolor: "rgba(16, 163, 127, 0.08)",
              },
            },
            "& .Mui-selected": {
              color: "#10a37f !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#10a37f",
              height: 3,
            },
          }}
        >
          <Tab label="Chat" />
          <Tab label="Search" />
        </Tabs>
      </motion.div>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          {tab === 0 ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex", width: "100%", height: "100%" }}
            >
              <SessionsNavbar
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
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", height: "100%" }}
            >
              <SearchTab />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
