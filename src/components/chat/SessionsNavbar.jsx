import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";
import api from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";

export default function SessionsNavbar({
  sessions,
  setSessions,
  activeSession,
  onSelectSession,
  onLogout,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleNewChat = async () => {
    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.SESSIONS, {});
      const newSession = res.data;
      
      setSessions((prev) => [newSession, ...prev]);
      onSelectSession(newSession);
      
      console.log("✅ Created new session:", newSession);
    } catch (err) {
      console.error("❌ Failed to create new session:", err);
      alert("Failed to create new session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    
    const confirmed = window.confirm(
      "Are you sure you want to delete this session?"
    );
    
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(API_ENDPOINTS.SESSION_DETAIL(id));
      
      setSessions((prev) => prev.filter((s) => s.id !== id));
      
      if (activeSession?.id === id) {
        onSelectSession(null);
      }
      
      console.log("✅ Deleted session:", id);
    } catch (err) {
      console.error("❌ Failed to delete session:", err);
      alert("Failed to delete session. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: "#111",
        borderRight: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #333" }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 2 }}>
          NewsLens
        </Typography>
        
        <Button
          variant="contained"
          fullWidth
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
          onClick={handleNewChat}
          disabled={loading}
          sx={{
            backgroundColor: "#10a37f",
            "&:hover": { backgroundColor: "#0e8f6e" },
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          {loading ? "Creating..." : "New Chat"}
        </Button>
      </Box>

      {/* Sessions List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "#888" }}>
            <Typography variant="body2">
              No sessions yet.
              <br />
              Start a new chat!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 1 }}>
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                disablePadding
                sx={{
                  mb: 0.5,
                  backgroundColor:
                    activeSession?.id === session.id ? "#1c1d21" : "transparent",
                  borderRadius: 1,
                  border:
                    activeSession?.id === session.id
                      ? "1px solid #10a37f"
                      : "1px solid transparent",
                }}
              >
                <ListItemButton
                  onClick={() => onSelectSession(session)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": { backgroundColor: "#1c1d21" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#fff",
                          fontWeight:
                            activeSession?.id === session.id ? "bold" : "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {session.title || "New Conversation"}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        {formatDate(session.updated_at)}
                      </Typography>
                    }
                  />
                  <Tooltip title="Delete session">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(session.id, e)}
                      disabled={deletingId === session.id}
                      sx={{
                        color: "#888",
                        "&:hover": { color: "#f44336" },
                      }}
                    >
                      {deletingId === session.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid #333" }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            color: "#888",
            borderColor: "#444",
            textTransform: "none",
            "&:hover": {
              borderColor: "#f44336",
              color: "#f44336",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
