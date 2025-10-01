import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Box,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

import ChatWindow from "./ChatWindow";
import SearchTab from "./SearchTab";
import ChatSessions from "./ChatSessions";

export default function ChatLayout({ onLogout }) {
  // 🔹 Default to Search tab (index = 1)
  const [tab, setTab] = useState(1);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NewsLens
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tabs for Chat and Search */}
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab icon={<ChatIcon />} label="Chat" />
        <Tab icon={<SearchIcon />} label="Search" />
      </Tabs>

      {/* Content */}
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
