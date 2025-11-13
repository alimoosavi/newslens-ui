import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, IconButton, CircularProgress, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

export default function ChatWindow({ activeSession, setActiveSession, sessions, setSessions }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch messages when active session changes
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

  // Handle sending messages
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    setStarted(true);
    const userMsg = { role: "user", content: newMessage };
    setNewMessage("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    let sessionId = activeSession?.id;
    
    // Create new session if none exists
    if (!sessionId) {
      try {
        const res = await api.post("/api/sessions/", {});
        const newSession = res.data;
        sessionId = newSession.id;
        setActiveSession(newSession);
        setSessions((prev) => [newSession, ...prev]);
      } catch (err) {
        console.error("Failed to create session:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Failed to create a new chat session. Please try again.",
            news: [],
          },
        ]);
        setLoading(false);
        return;
      }
    }

    // Send message to chat endpoint
    try {
      const res = await api.post(`/api/sessions/${sessionId}/chat/`, {
        message: userMsg.content,
      });

      // Add assistant response with news items
      setMessages((prev) => [
        ...prev,
        {
          id: res.data.message_id,
          role: "assistant",
          content: res.data.response,
          news: res.data.news_items || [],
        },
      ]);

      // Update session timestamp
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, updated_at: new Date().toISOString() }
            : s
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your message. Please try again.",
          news: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback submission
  const handleFeedback = async (messageId, feedbackType) => {
    if (!activeSession?.id || !messageId) return;
    
    try {
      await api.post(
        `/api/sessions/${activeSession.id}/messages/${messageId}/feedback/`,
        { feedback: feedbackType }
      );
      
      // Update local message feedback state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, feedback: feedbackType } : msg
        )
      );
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        p: 2, 
        backgroundColor: "#0b0c0f" 
      }}
    >
      {/* Messages Container */}
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
                  mb: 2,
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* Message Bubble */}
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.role === "user" ? "#10a37f" : "#1c1d21",
                    color: msg.role === "user" ? "#fff" : "#e5e5e5",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </Box>

                {/* News Items */}
                {msg.news && msg.news.length > 0 && (
                  <Box 
                    sx={{ 
                      mt: 1, 
                      pl: 2, 
                      borderLeft: "2px solid #333",
                      maxWidth: "70%",
                    }}
                  >
                    {msg.news.map((newsItem, i) => (
                      <Box
                        key={i}
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          bgcolor: "#1a1b1f",
                          borderRadius: 1,
                          "&:hover": { bgcolor: "#222" },
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(newsItem.link, "_blank")}
                      >
                        <Typography variant="subtitle2" sx={{ color: "#10a37f", mb: 0.5 }}>
                          {newsItem.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#bbb", fontSize: "0.85rem" }}>
                          {newsItem.summary}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666", mt: 0.5, display: "block" }}>
                          {newsItem.source} • {new Date(newsItem.published_datetime).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Feedback Buttons (for assistant messages) */}
                {msg.role === "assistant" && msg.id && (
                  <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleFeedback(msg.id, "positive")}
                      sx={{
                        color: msg.feedback === "positive" ? "#10a37f" : "#666",
                        "&:hover": { color: "#10a37f" },
                      }}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleFeedback(msg.id, "negative")}
                      sx={{
                        color: msg.feedback === "negative" ? "#f44336" : "#666",
                        "&:hover": { color: "#f44336" },
                      }}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
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

      {/* Input Area */}
      <motion.div
        animate={{ y: started ? 0 : "-50%" }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginTop: started ? "auto" : 0 
        }}
      >
        <Box sx={{ display: "flex", width: "100%", maxWidth: 700, gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            disabled={loading}
            sx={{
              "& .MuiInputBase-root": {
                color: "#fff",
                bgcolor: "#1c1d21",
                borderRadius: "25px",
              },
              "& .MuiOutlinedInput-root": {
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
              "&:hover": { bgcolor: "#0d8a6a" },
              "&:disabled": { bgcolor: "#333", color: "#666" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </motion.div>
    </Box>
  );
}
