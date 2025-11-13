import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import api from "../api";

export default function ChatSessions({ onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/api/sessions/");
        setSessions(response.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <List>
        <ListItem>
          <CircularProgress size={24} />
        </ListItem>
      </List>
    );
  }

  if (error) {
    return (
      <List>
        <ListItem>
          <ListItemText primary={error} />
        </ListItem>
      </List>
    );
  }

  return (
    <List>
      {sessions.length === 0 ? (
        <ListItem>
          <ListItemText primary="No sessions yet" />
        </ListItem>
      ) : (
        sessions.map((s) => (
          <ListItem
            button
            key={s.id}
            onClick={() => onSelectSession(s)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(16, 163, 127, 0.1)",
              },
            }}
          >
            <ListItemText
              primary={s.title || `Session ${s.id.slice(0, 8)}`}
              secondary={new Date(s.updated_at).toLocaleString()}
            />
          </ListItem>
        ))
      )}
    </List>
  );
}
