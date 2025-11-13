import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";

export default function SessionsNavbar({
  sessions = [], // ✅ Default to empty array
  setSessions,
  activeSession,
  onSelectSession,
  onLogout,
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleNewChat = async () => {
    setCreating(true);
    try {
      const res = await api.post("/api/sessions/", {});
      const newSession = res.data;
      setSessions((prev) => [newSession, ...(Array.isArray(prev) ? prev : [])]);
      onSelectSession(newSession);
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create new chat session");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/sessions/${id}/`);
      setSessions((prev) => (Array.isArray(prev) ? prev.filter((s) => s.id !== id) : []));
      if (activeSession?.id === id) {
        onSelectSession(null);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
      alert("Failed to delete chat session");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Ensure sessions is always an array
  const sessionsList = Array.isArray(sessions) ? sessions : [];

  return (
    <Box
      sx={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#111",
        color: "#fff",
        borderRight: "1px solid #2a2a2a",
        height: "100%",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #10a37f, #1a7f64)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NewsLens
          </Typography>
          <IconButton
            onClick={onLogout}
            sx={{
              color: "#aaa",
              transition: "all 0.2s",
              "&:hover": {
                color: "#fff",
                bgcolor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </motion.div>

      {/* New Chat Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="contained"
          disabled={creating}
          onClick={handleNewChat}
          sx={{
            mx: 2,
            my: 2,
            bgcolor: "#10a37f",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            py: 1.2,
            fontSize: "0.95rem",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#0d8a6a",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(16, 163, 127, 0.3)",
            },
            "&:disabled": {
              bgcolor: "#2a2a2a",
              color: "#666",
            },
          }}
        >
          {creating ? (
            <CircularProgress size={20} sx={{ color: "#666" }} />
          ) : (
            "+ New Chat"
          )}
        </Button>
      </motion.div>

      <Divider sx={{ borderColor: "#2a2a2a" }} />

      {/* Sessions List */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1, py: 1 }}>
        {sessionsList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box
              sx={{
                textAlign: "center",
                color: "#666",
                mt: 4,
                px: 2,
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                No chat sessions yet
              </Typography>
              <Typography variant="caption" sx={{ color: "#444" }}>
                Click "New Chat" to start
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {sessionsList.map((s, index) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  layout
                >
                  <ListItem
                    selected={activeSession?.id === s.id}
                    onClick={() => onSelectSession(s)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius: 2,
                      mb: 0.5,
                      px: 1.5,
                      py: 1,
                      transition: "all 0.2s",
                      "&.Mui-selected": {
                        backgroundColor: "#1a1a1a",
                        borderLeft: "3px solid #10a37f",
                        "&:hover": { backgroundColor: "#222" },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={s.title || `Session ${s.id.slice(0, 8)}`}
                      secondary={new Date(s.updated_at).toLocaleString()}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          fontSize: "0.9rem",
                          fontWeight: activeSession?.id === s.id ? 600 : 400,
                          color: activeSession?.id === s.id ? "#fff" : "#ddd",
                        },
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: "#666",
                        sx: { fontSize: "0.75rem" },
                      }}
                    />
                    <IconButton
                      size="small"
                      disabled={deletingId === s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s.id);
                      }}
                      sx={{
                        color: "#666",
                        ml: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "#f44336",
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                          transform: "scale(1.1)",
                        },
                        "&:disabled": {
                          color: "#444",
                        },
                      }}
                    >
                      {deletingId === s.id ? (
                        <CircularProgress size={16} sx={{ color: "#666" }} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Box>
    </Box>
  );
}
