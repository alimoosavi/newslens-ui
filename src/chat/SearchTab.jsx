import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  CircularProgress,
} from "@mui/material";
import api from "../api"; // your axios instance

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const response = await api.post("/api/search/", { query });
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to fetch search results. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Search bar */}
      <Box sx={{ display: "flex", mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ ml: 1 }}
          disabled={loading}
        >
          Search
        </Button>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Results */}
      <Grid container spacing={2}>
        {results.map((item, idx) => {
          const payload = item.payload;
          return (
            <Grid item xs={12} md={6} key={idx}>
              <Card>
                {payload.images && payload.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={payload.images[0]}
                    alt={payload.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <a
                      href={payload.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "#1976d2" }}
                    >
                      {payload.title}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {payload.summary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(payload.published_datetime).toLocaleString()} |{" "}
                    {payload.source}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
