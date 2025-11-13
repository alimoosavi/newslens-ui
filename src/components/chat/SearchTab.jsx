import React, { useState } from "react";
import { Box, TextField, Button, CircularProgress, Typography, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";
import NewsItem from "./NewsItem";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.SEARCH, { query });
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#0b0c0f", p: 3 }}>
      <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
        🔍 Search News
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for news..."
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1c1d21",
              color: "#fff",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#10a37f" },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{ bgcolor: "#10a37f", "&:hover": { bgcolor: "#0e8f6e" } }}
        >
          {loading ? <CircularProgress size={24} /> : <SearchIcon />}
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {results.map((item, idx) => (
          <NewsItem key={idx} news={item} />
        ))}
      </Box>
    </Box>
  );
}
