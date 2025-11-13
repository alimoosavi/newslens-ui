import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api";

export default function ChatSidebar({
  activeSession,
  onSelectSession,
  sessions,
  setSessions,
  onLogout,
}) {
  const handleNewChat = async () => {
    try {
      const res = await api.post("/api/sessions/", {});
      const newSession = res.data;
      setSessions((prev) => [newSession, ...prev]);
      onSelectSession(newSession);
    } catch (err) {
      console.error("Failed to create new session:", err);
      alert("Failed to create new chat session");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    
    try {
      await api.delete(`/api/sessions/${id}/`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSession?.id === id) {
        onSelectSession(null);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
      alert("Failed to delete chat session");
    }
  };

  const handleClearMessages = async (id) => {
    if (!window.confirm("Are you sure you want to clear all messages in this chat?")) return;
    
    try {
      await api.delete(`/api/sessions/${id}/clear/`);
      if (activeSession?.id === id) {
        onSelectSession({ ...activeSession });
      }
    } catch (err) {
      console.error("Failed to clear messages:", err);
      alert("Failed to clear messages");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 280,
        bgcolor: "#000",
        color: "#fff",
        borderRight: "1px solid #333",
      }}
    >
      {/* New Chat Button */}
      <Button
        variant="contained"
        sx={{
          m: 2,
          backgroundColor: "#10a37f",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#0d8a6a" },
        }}
        onClick={handleNewChat}
      >
        + New Chat
      </Button>

      <Divider sx={{ borderColor: "#333" }} />

      {/* Sessions List */}
      <List sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {sessions.length === 0 && (
          <Box sx={{ textAlign: "center", color: "#666", mt: 4, px: 2 }}>
            <Typography variant="body2">No chat sessions yet</Typography>
            <Typography variant="caption" sx={{ color: "#444" }}>
              Click "New Chat" to start
            </Typography>
          </Box>
        )}
        
        {sessions.map((s) => (
          <ListItem
            key={s.id}
            selected={activeSession?.id === s.id}
            onClick={() => onSelectSession(s)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: "#333",
                "&:hover": { backgroundColor: "#444" },
              },
              "&:hover": { backgroundColor: "#111" },
            }}
          >
            <ListItemText
              primary={s.title || `Chat ${s.id.slice(0, 8)}`}
              secondary={new Date(s.updated_at).toLocaleString()}
              primaryTypographyProps={{ 
                noWrap: true,
                sx: { fontSize: "0.9rem" }
              }}
              secondaryTypographyProps={{
                variant: "caption",
                color: "grey.500",
              }}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(s.id);
              }}
              sx={{ 
                color: "#aaa", 
                "&:hover": { color: "#f44336" },
                ml: 1,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "#333" }} />

      {/* Logout Button */}
      {onLogout && (
        <Button
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            m: 2,
            color: "#aaa",
            textTransform: "none",
            "&:hover": { bgcolor: "#111", color: "#fff" },
          }}
        >
          Logout
        </Button>
      )}
    </Box>
  );
}
