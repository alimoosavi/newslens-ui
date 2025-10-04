import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, IconButton } from "@mui/material";
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
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  // Fetch messages for the active session
  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/sessions/${activeSession.id}/`);
        if (res.data.history && res.data.history.length > 0) {
          setMessages(res.data.history);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [activeSession]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    let sessionId = activeSession?.id;
    const userMsg = { role: "user", content: newMessage };

    // show user message immediately
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage(""); // clear input
    setLoading(true);

    // If no active session, create one
    if (!sessionId) {
      try {
        const res = await api.post("/api/sessions/", {});
        sessionId = res.data.id;
        const newSession = { ...res.data };
        setActiveSession(newSession);
        setSessions([newSession, ...sessions]);
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

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, updated_at: new Date().toISOString() }
            : s
        )
      );
    } catch (err) {
      console.error(err);
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

          {/* Loading animation */}
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
