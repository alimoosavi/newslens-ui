import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";
import NewsItem from "./NewsItem";


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
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when session changes
  useEffect(() => {
    if (activeSession) {
      inputRef.current?.focus();
    }
  }, [activeSession?.id]);

  // Fetch messages when active session changes
  useEffect(() => {
    if (!activeSession?.id) {
      setMessages([]);
      setStarted(false);
      setError("");
      return;
    }

    const fetchMessages = async () => {
      setFetchingHistory(true);
      setError("");

      try {
        const res = await api.get(API_ENDPOINTS.SESSION_MESSAGES(activeSession.id));

        // Handle paginated response
        const messagesData = res.data.results || res.data;
        const msgs = Array.isArray(messagesData) ? messagesData : [];

        setMessages(msgs);
        setStarted(msgs.length > 0);

        console.log("✅ Fetched messages:", msgs);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
        setMessages([]);
        setStarted(false);
        setError("Failed to load messages.");
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchMessages();
  }, [activeSession?.id]);

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    setStarted(true);
    setError("");

    const userMsg = { role: "user", content: trimmedMessage };
    setNewMessage("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    let sessionId = activeSession?.id;

    // Create new session if none exists
    if (!sessionId) {
      try {
        const res = await api.post(API_ENDPOINTS.SESSIONS, {});
        const newSession = res.data;
        sessionId = newSession.id;
        setActiveSession(newSession);
        setSessions((prev) => [newSession, ...prev]);

        console.log("✅ Created new session:", newSession);
      } catch (err) {
        console.error("❌ Failed to create session:", err);
        setError("Failed to create session. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Send message
    try {
      const res = await api.post(API_ENDPOINTS.SESSION_CHAT(sessionId), {
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

      // Update session timestamp in list
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, updated_at: new Date().toISOString() }
            : s
        )
      );

      console.log("✅ Sent message, received response");
    } catch (err) {
      console.error("❌ Failed to send message:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          error: true,
        },
      ]);

      setError(
        err.response?.data?.error ||
        "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
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
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3,
          py: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Loading History */}
        {fetchingHistory && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} sx={{ color: "#10a37f" }} />
          </Box>
        )}

        {/* Welcome Message */}
        {!started && !fetchingHistory && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: "bold" }}>
              NewsLens
            </Typography>
            <Typography variant="body1" sx={{ color: "#888", maxWidth: 500 }}>
              Your AI-powered news assistant. Ask me anything about recent news,
              events, or topics you're interested in.
            </Typography>
          </Box>
        )}

        {/* Messages */}
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
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {/* Message Bubble */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: msg.role === "user" ? "#10a37f" : "#1c1d21",
                      color: msg.role === "user" ? "#fff" : "#e5e5e5",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      ...(msg.error && {
                        bgcolor: "#4a1010",
                        borderLeft: "3px solid #f44336",
                      }),
                    }}
                  >
                    {msg.content}
                  </Paper>

                  {/* News Items */}
                  {msg.news && msg.news.length > 0 && (
                    <Box
                      sx={{
                        mt: 1,
                        pl: 2,
                        borderLeft: "3px solid #10a37f",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#888", fontWeight: "bold" }}
                      >
                        📰 Related News ({msg.news.length})
                      </Typography>
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

        {/* Typing Indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#1c1d21",
                color: "#888",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={16} sx={{ color: "#10a37f" }} />
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Thinking...
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#4a1010",
                color: "#f44336",
                maxWidth: "70%",
              }}
            >
              ⚠️ {error}
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 3,
          borderTop: "1px solid #333",
          backgroundColor: "#0b0c0f",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              activeSession
                ? "Type your message..."
                : "Select a session or start a new chat..."
            }
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#1c1d21",
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#10a37f" },
                "&.Mui-focused fieldset": { borderColor: "#10a37f" },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={loading || !newMessage.trim()}
            sx={{
              bgcolor: "#10a37f",
              color: "#fff",
              "&:hover": { bgcolor: "#0e8f6e" },
              "&:disabled": { bgcolor: "#444", color: "#888" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
