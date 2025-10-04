import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatWindow from "./ChatWindow";
import ChatSidebar from "./ChatSidebar";
import SearchTab from "./SearchTab";
import { useNavigate } from "react-router-dom";

export default function ChatLayout() {
  const [tab, setTab] = useState(0); // Chat tab first
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]); // All sessions
  const navigate = useNavigate();

  const handleChange = (event, newValue) => setTab(newValue);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" elevation={1} sx={{ backgroundColor: "#0c0d10" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
            NewsLens
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Chat" />
        <Tab label="Search" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {tab === 0 && (
          <Box sx={{ display: "flex", flex: 1 }}>
            {/* Left Sidebar */}
            <Box sx={{ width: 280, borderRight: 1, borderColor: "#222", overflowY: "auto" }}>
              <ChatSidebar
                sessions={sessions}
                activeSession={activeSession}
                onSelectSession={setActiveSession}
              />
            </Box>
            {/* Chat Window */}
            <Box sx={{ flex: 1 }}>
              <ChatWindow
                activeSession={activeSession}
                setActiveSession={setActiveSession}
                sessions={sessions}
                setSessions={setSessions}
              />
            </Box>
          </Box>
        )}
        {tab === 1 && <SearchTab />}
      </Box>
    </Box>
  );
}
