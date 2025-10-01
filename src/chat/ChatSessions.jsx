import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

export default function ChatSessions() {
  // Placeholder sessions
  const sessions = [
    { id: 1, name: "Session 1" },
    { id: 2, name: "Session 2" },
  ];

  return (
    <List>
      {sessions.map((s) => (
        <ListItem button key={s.id}>
          <ListItemText primary={s.name} />
        </ListItem>
      ))}
    </List>
  );
}
