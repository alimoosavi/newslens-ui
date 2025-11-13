import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import NewsItem from "./NewsItem";

export default function ChatWindow({ activeSession, setActiveSession, sessions, setSessions }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (!activeSession?.id) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      setFetchingHistory(true);
      try {
        const res = await api.get(`/api/sessions/${activeSession.id}/messages/`);
        const msgs = Array.isArray(res.data) ? res.data : res.data.results || [];
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      } finally {
        setFetchingHistory(false);
      }
    };
    fetchMessages();
  }, [activeSession?.id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { role: "user", content: newMessage };
    setNewMessage("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    let sessionId = activeSession?.id;
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
        {
          role: "assistant",
          content: res.data.response,
          news: res.data.news_items || [],
        },
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
        backgroundColor: "#0b0c0f",
        position: "relative",
      }}
    >
      {/* Messages Container */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: 3,
          py: 3,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#1a1a1a",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#333",
            borderRadius: "4px",
            "&:hover": {
              background: "#444",
            },
          },
        }}
      >
        {fetchingHistory && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress color="inherit" size={24} />
          </Box>
        )}

        {/* Empty State */}
        {!fetchingHistory && messages.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              color: "#666",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  fontSize: "3rem",
                  mb: 2,
                  background: "linear-gradient(90deg, #10a37f, #1a7f64)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                NewsLens AI
              </Box>
              <Box sx={{ fontSize: "1.1rem", color: "#888", mb: 1 }}>
                Start a conversation to get AI-powered news insights
              </Box>
              <Box sx={{ fontSize: "0.9rem", color: "#555" }}>
                Ask me anything about current events, news, or topics you're interested in
              </Box>
            </motion.div>
          </Box>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  mb: 2.5,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    maxWidth: msg.role === "user" ? "70%" : "85%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {/* Message Bubble */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: msg.role === "user" ? "#10a37f" : "#1c1d21",
                      color: msg.role === "user" ? "#fff" : "#e5e5e5",
                      wordBreak: "break-word",
                      boxShadow:
                        msg.role === "user"
                          ? "0 2px 8px rgba(16, 163, 127, 0.3)"
                          : "0 2px 8px rgba(0, 0, 0, 0.2)",
                      border: msg.role === "user" ? "none" : "1px solid #2a2a2a",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.content}
                  </Box>

                  {/* News Items (Only for assistant messages) */}
                  {msg.role === "assistant" && msg.news && msg.news.length > 0 && (
                    <Box
                      sx={{
                        mt: 1.5,
                        width: "100%",
                        pl: 2,
                        borderLeft: "3px solid #10a37f",
                      }}
                    >
                      {msg.news.map((n, i) => (
                        <NewsItem key={i} news={n} />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#1c1d21",
                  color: "#888",
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid #2a2a2a",
                }}
              >
                <CircularProgress size={16} sx={{ color: "#10a37f" }} />
                <span>Thinking...</span>
              </Box>
            </Box>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Box - Fixed at Bottom */}
      <Box
        sx={{
          borderTop: "1px solid #2a2a2a",
          backgroundColor: "#111",
          p: 2.5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 900,
            gap: 1.5,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                bgcolor: "#1c1d21",
                color: "#fff",
                border: "1px solid #2a2a2a",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#10a37f",
                },
                "&.Mui-focused": {
                  borderColor: "#10a37f",
                  boxShadow: "0 0 0 2px rgba(16, 163, 127, 0.1)",
                },
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                color: "#fff",
                fontSize: "0.95rem",
                py: 1.5,
                "&::placeholder": {
                  color: "#666",
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || !newMessage.trim()}
            sx={{
              bgcolor: "#10a37f",
              color: "#fff",
              width: 48,
              height: 48,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "#0d8a6a",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(16, 163, 127, 0.4)",
              },
              "&:disabled": {
                bgcolor: "#2a2a2a",
                color: "#666",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
