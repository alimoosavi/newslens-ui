import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

import ChatWindow from "./ChatWindow";
import SearchTab from "./SearchTab";
import ChatSessions from "./ChatSessions";

export default function ChatLayout() {
  const [tab, setTab] = useState(1); // Search tab default
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  // 🔹 Logout logic here
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // remove JWT
    navigate("/login"); // redirect to login page
  };

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NewsLens
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="Chat" />
        <Tab label="Search" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {tab === 0 && (
          <Box sx={{ display: "flex", height: "100%" }}>
            <Box sx={{ width: 240, borderRight: "1px solid #ccc", overflowY: "auto" }}>
              <ChatSessions />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ChatWindow />
            </Box>
          </Box>
        )}
        {tab === 1 && <SearchTab />}
      </Box>
    </Box>
  );
}
