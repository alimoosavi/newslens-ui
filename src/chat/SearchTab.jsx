import React, { useState } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Placeholder logic: just echo query as result
    if (!query.trim()) return;
    setResults([{ id: Date.now(), title: `Result for "${query}"` }]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
          Search
        </Button>
      </Box>
      <List>
        {results.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
