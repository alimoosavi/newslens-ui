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
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load historical messages when switching sessions
  useEffect(() => {
    if (!activeSession?.id) {
      setMessages([]);
      setStarted(false);
      return;
    }

    const fetchMessages = async () => {
      setFetchingHistory(true);
      try {
        const res = await api.get(`/api/sessions/${activeSession.id}/messages/`);
        const msgs = Array.isArray(res.data) ? res.data : res.data.results || [];
        setMessages(msgs);
        setStarted(msgs.length > 0);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
        setStarted(false);
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchMessages();
  }, [activeSession?.id]);

  // Send new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setStarted(true);
    const userMsg = { role: "user", content: newMessage };
    setNewMessage("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    let sessionId = activeSession?.id;

    // create session if none exists
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

    try {
      const res = await api.post(`/api/sessions/${sessionId}/chat/`, {
        message: userMsg.content,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);

      // update session timestamp
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2, backgroundColor: "#0b0c0f" }}>
      {/* Messages list */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: started ? 2 : 0 }}>
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
              transition={{ duration: 0.2 }}
            >
              <Box
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
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
            <Box
              sx={{
                maxWidth: "60%",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#1c1d21",
                color: "#e5e5e5",
                fontStyle: "italic",
              }}
            >
              Thinking...
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input field with animation */}
      <motion.div
        animate={{ y: started ? 0 : "-50%" }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ display: "flex", justifyContent: "center", marginTop: started ? "auto" : 0 }}
      >
        <Box sx={{ display: "flex", width: "100%", maxWidth: 700 }}>
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
              "& .MuiOutlinedInput-root": { borderRadius: "25px", bgcolor: "#1c1d21" },
            }}
          />
          <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
