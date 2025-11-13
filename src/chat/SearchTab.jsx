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
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import api from "../api";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [logId, setLogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchPerformed(false);
    
    try {
      const response = await api.post("/api/search/", { query: query.trim() });
      const data = response.data;

      setLogId(data.log_id);
      setResults(data.results || []);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Track clicks on search results
  const handleResultClick = async (newsItem, rank) => {
    if (!logId) {
      window.open(newsItem.link, "_blank");
      return;
    }

    try {
      await api.post("/api/search/click/", {
        log_id: logId,
        news_id: newsItem.id,
        rank: rank + 1, // rank is 1-indexed
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }

    // Open link in new tab
    window.open(newsItem.link, "_blank");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
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
          mb: searchPerformed ? 3 : 0,
          transition: "all 0.5s ease",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 700 }}>
          <TextField
            placeholder="Search news articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            disabled={loading}
            sx={{
              input: { color: "#fff", padding: "14px 20px" },
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
                  <IconButton 
                    onClick={handleSearch} 
                    disabled={loading || !query.trim()}
                    sx={{ 
                      color: "#10a37f",
                      "&:disabled": { color: "#444" },
                    }}
                  >
                    {query.trim() ? <ArrowUpwardIcon /> : <SearchIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {/* Search Tips */}
          {!searchPerformed && !loading && (
            <Box sx={{ mt: 2, textAlign: "center", color: "#666" }}>
              <Typography variant="caption">
                Try searching for topics like "technology", "sports", "politics", etc.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#10a37f" }} />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ textAlign: "center", color: "#f44336", my: 2 }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      {/* Results */}
      {searchPerformed && !loading && !error && (
        <Box sx={{ flex: 1, overflowY: "auto", mt: 1 }}>
          {/* Meta Info */}
          <Box sx={{ mb: 3, textAlign: "center", color: "#aaa" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {results.length} {results.length === 1 ? "result" : "results"} found
            </Typography>
            {logId && (
              <Typography variant="caption" sx={{ color: "#666" }}>
                Search ID: {logId.slice(0, 12)}...
              </Typography>
            )}
          </Box>

          {/* Results Grid */}
          {results.length > 0 ? (
            <Grid container spacing={3} sx={{ px: 2 }}>
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
                        transition: "all 0.2s",
                        cursor: "pointer",
                        "&:hover": { 
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                        },
                      }}
                      onClick={() => handleResultClick(news, idx)}
                    >
                      {/* News Image */}
                      {news.images?.[0] && (
                        <CardMedia
                          component="img"
                          height="160"
                          image={news.images[0]}
                          alt={news.title}
                          sx={{ 
                            borderRadius: "12px 12px 0 0",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      
                      {/* News Content */}
                      <CardContent
                        sx={{ 
                          flex: 1, 
                          display: "flex", 
                          flexDirection: "column",
                          p: 2,
                        }}
                      >
                        {/* Title */}
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            lineHeight: 1.3,
                            mb: 1,
                          }}
                        >
                          {news.title}
                        </Typography>
                        
                        {/* Summary */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            flex: 1, 
                            mb: 1.5,
                            color: "#bbb",
                            fontSize: "0.85rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {news.summary}
                        </Typography>
                        
                        {/* Keywords */}
                        {news.keywords && news.keywords.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mb: 1.5,
                            }}
                          >
                            {news.keywords.slice(0, 3).map((kw, i) => (
                              <Chip
                                key={i}
                                size="small"
                                label={kw}
                                sx={{ 
                                  backgroundColor: "#333", 
                                  color: "#fff",
                                  fontSize: "0.7rem",
                                  height: 20,
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        
                        {/* Meta Info */}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: "#888",
                            mb: 1.5,
                          }}
                        >
                          {news.source} • {new Date(news.published_datetime).toLocaleDateString()}
                        </Typography>
                        
                        {/* Read More Button */}
                        <Button
                          size="small"
                          endIcon={<OpenInNewIcon fontSize="small" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResultClick(news, idx);
                          }}
                          sx={{
                            mt: "auto",
                            color: "#10a37f",
                            borderColor: "#10a37f",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "rgba(16, 163, 127, 0.1)",
                              borderColor: "#10a37f",
                            },
                          }}
                          variant="outlined"
                        >
                          Read Article
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            // No Results Found
            <Box sx={{ textAlign: "center", color: "#666", mt: 8 }}>
              <SearchIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body2">
                Try a different search query or more general terms
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
