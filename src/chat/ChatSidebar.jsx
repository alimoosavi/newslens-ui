import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api"; // axios instance

/**
 * ChatSidebar Component
 *
 * Props:
 * - activeSession: currently active session object
 * - onSelectSession: function(session|null) to handle selection or new session
 */
export default function ChatSidebar({ activeSession, onSelectSession }) {
  const [sessions, setSessions] = useState([]);

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get("/api/sessions/");
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Create a new chat session
  const handleNewChat = async () => {
    try {
      const res = await api.post("/api/sessions/", {}); // Django will auto-assign user
      const newSession = res.data;
      setSessions((prev) => [newSession, ...prev]);
      onSelectSession(newSession);
    } catch (err) {
      console.error("Failed to create new session:", err);
    }
  };

  // Delete a chat session
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/sessions/${id}/`);
      setSessions((prev) => prev.filter((s) => s.id !== id));

      // If deleting active session, reset selection
      if (activeSession?.id === id) {
        onSelectSession(null);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 280,
        bgcolor: "#000000",
        color: "#ffffff",
      }}
    >
      {/* New Chat Button */}
      <Button
        variant="contained"
        sx={{
          m: 2,
          backgroundColor: "#10a37f",
          color: "#fff",
          textTransform: "none",
          fontWeight: "bold",
        }}
        onClick={handleNewChat}
      >
        + New Chat
      </Button>

      <Divider sx={{ borderColor: "#333" }} />

      {/* Session List */}
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {sessions.map((s) => (
          <ListItem
            key={s.id}
            selected={activeSession?.id === s.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&.Mui-selected": {
                backgroundColor: "#333333",
                "&:hover": { backgroundColor: "#444444" },
              },
              "&:hover": {
                backgroundColor: "#111111",
              },
              color: "#fff",
            }}
          >
            <ListItemText
              primary={s.title || `Session ${s.id.slice(0, 6)}`}
              secondary={new Date(s.updated_at).toLocaleString()}
              primaryTypographyProps={{ noWrap: true }}
              secondaryTypographyProps={{ variant: "caption", color: "grey.500" }}
              onClick={() => onSelectSession(s)} // Select session on click
              sx={{ cursor: "pointer" }}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(s.id)}
              sx={{ color: "#aaa" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
