import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api";

export default function SessionsNavbar({
  sessions,
  setSessions,
  activeSession,
  onSelectSession,
  onLogout,
}) {
  const handleNewChat = async () => {
    try {
      const res = await api.post("/api/sessions/", {});
      const newSession = res.data;
      setSessions((prev) => [newSession, ...prev]);
      onSelectSession(newSession);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/sessions/${id}/`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSession?.id === id) onSelectSession(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#111",
        color: "#fff",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">NewsLens</Typography>
        <IconButton onClick={onLogout} sx={{ color: "#fff" }}>
          <LogoutIcon />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        sx={{
          mx: 2,
          mb: 2,
          bgcolor: "#10a37f",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
        }}
        onClick={handleNewChat}
      >
        + New Chat
      </Button>

      <Divider sx={{ borderColor: "#333" }} />

      {/* Sessions List */}
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {sessions.map((s) => (
          <ListItem
            key={s.id}
            selected={activeSession?.id === s.id}
            onClick={() => onSelectSession(s)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              bgcolor: activeSession?.id === s.id ? "#222" : "transparent",
              "&:hover": { bgcolor: "#222" },
            }}
          >
            <ListItemText
              primary={s.title || `Session ${s.id.slice(0, 6)}`}
              secondary={new Date(s.updated_at).toLocaleString()}
              primaryTypographyProps={{ noWrap: true, color: "#fff" }}
              secondaryTypographyProps={{ variant: "caption", color: "grey.500" }}
            />
            <IconButton
              size="small"
              sx={{ color: "#aaa" }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(s.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
