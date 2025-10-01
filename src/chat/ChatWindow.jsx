import React, { useState } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Welcome to NewsLens Chat!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), role: "user", content: newMessage }]);
    setNewMessage("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {messages.map((msg) => (
          <ListItem key={msg.id}>
            <ListItemText
              primary={msg.content}
              secondary={msg.role}
              sx={{ wordBreak: "break-word" }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", mt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
