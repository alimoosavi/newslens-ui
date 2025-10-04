import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import api from "../api"; // Axios instance

export default function ChatSessions({ onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/api/sessions/");
        setSessions(response.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <List>
      {loading ? (
        <ListItem>
          <ListItemText primary="Loading..." />
        </ListItem>
      ) : (
        sessions.map((s) => (
          <ListItem button key={s.id} onClick={() => onSelectSession(s)}>
            <ListItemText primary={`Session ${s.id}`} secondary={s.summary} />
          </ListItem>
        ))
      )}
    </List>
  );
}
