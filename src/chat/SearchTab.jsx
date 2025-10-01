import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import api from "../api";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await api.post("/api/search/", { query });
      setResults(response.data.results || []);
      setSearchPerformed(true);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0b0c0f",
        p: 2,
        overflow: "hidden",
      }}
    >
      {/* Search Input */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: searchPerformed ? "flex-start" : "center",
          flex: searchPerformed ? "0 0 auto" : 1,
          mb: searchPerformed ? 2 : 0,
          transition: "all 0.5s",
        }}
      >
        <TextField
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          fullWidth
          sx={{
            maxWidth: 700,
            input: { color: "#fff", padding: "14px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              backgroundColor: "#1c1d21",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#10a37f" },
              "&.Mui-focused fieldset": { borderColor: "#10a37f" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} sx={{ color: "#10a37f" }}>
                  {query.trim() ? <ArrowUpwardIcon /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress color="inherit" />
        </Box>
      )}

      {/* Results */}
      {searchPerformed && (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mt: 1,
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            {results.map((item, idx) => {
              const news = item.payload;
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      backgroundColor: "#1c1d21",
                      color: "#e5e5e5",
                      borderRadius: 3,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    {news.images?.[0] && (
                      <CardMedia
                        component="img"
                        height="160"
                        image={news.images[0]}
                        alt={news.title}
                        sx={{ borderRadius: "12px 12px 0 0" }}
                      />
                    )}
                    <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <Typography variant="h6" gutterBottom>
                        {news.title}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1, mb: 1 }}>
                        {news.summary}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                        {news.keywords?.map((kw, i) => (
                          <Chip key={i} size="small" label={kw} sx={{ backgroundColor: "#333", color: "#fff" }} />
                        ))}
                      </Box>
                      <Typography variant="caption" color="#888">
                        {news.source} | {new Date(news.published_datetime).toLocaleString()}
                      </Typography>
                      <IconButton
                        size="small"
                        component="a"
                        href={news.link}
                        target="_blank"
                        sx={{
                          mt: 1,
                          color: "#10a37f",
                          borderColor: "#10a37f",
                        }}
                      >
                        Read More
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
