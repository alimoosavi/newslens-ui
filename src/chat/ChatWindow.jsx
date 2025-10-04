import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

export default function ChatWindow({
  activeSession,
  setActiveSession,
  sessions,
  setSessions,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, loading]);

  // Fetch messages when activeSession changes
  useEffect(() => {
    if (!activeSession?.id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setFetchingHistory(true);
      try {
        const res = await api.get(`/api/sessions/${activeSession.id}/messages/`);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      } finally {
        setFetchingHistory(false);
      }
    };

    // Clear old messages immediately
    setMessages([]);
    fetchMessages();
  }, [activeSession?.id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { role: "user", content: newMessage };
    setNewMessage("");
    setLoading(true);

    let sessionId = activeSession?.id;

    // Create session if none exists
    if (!sessionId) {
      try {
        const res = await api.post("/api/sessions/", {});
        const newSession = res.data;
        sessionId = newSession.id;
        setActiveSession(newSession);
        setSessions((prev) => [newSession, ...prev]);
      } catch (err) {
        console.error("Failed to create session:", err);
        setLoading(false);
        return;
      }
    }

    // Add user message immediately
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await api.post(`/api/sessions/${sessionId}/chat/`, {
        message: userMsg.content,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, updated_at: new Date().toISOString() }
            : s
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        backgroundColor: "#0b0c0f",
      }}
    >
      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {fetchingHistory && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress color="inherit" size={24} />
          </Box>
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
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
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "60%",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#1c1d21",
                    color: "#e5e5e5",
                    fontStyle: "italic",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span>Thinking</span>
                  <motion.span
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              bgcolor: "#1c1d21",
            },
          }}
        />
        <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
