import React, { useEffect, useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "../api";

export default function ChatWindow({ activeSession, setActiveSession, sessions, setSessions }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/sessions/${activeSession.id}/`);
        setMessages(res.data.history || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeSession]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    let sessionId = activeSession?.id;

    // If no active session, create a new one
    if (!sessionId) {
      try {
        const res = await api.post("/api/sessions/", {});
        sessionId = res.data.id;
        const newSession = { ...res.data };
        setSessions([newSession, ...sessions]);
        setActiveSession(newSession);
      } catch (err) {
        console.error("Failed to create session:", err);
        return;
      }
    }

    try {
      const res = await api.post(`/api/sessions/${sessionId}/chat/`, { message: newMessage });
      setMessages([...messages, { role: "user", content: newMessage }, { role: "assistant", content: res.data.response }]);

      // Update session summary in sidebar
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, updated_at: new Date().toISOString() } : s))
      );
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2, backgroundColor: "#0b0c0f" }}>
      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "60%",
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.role === "user" ? "#10a37f" : "#1c1d21",
                color: msg.role === "user" ? "#fff" : "#e5e5e5",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": { borderRadius: "25px", bgcolor: "#1c1d21" },
          }}
        />
        <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
