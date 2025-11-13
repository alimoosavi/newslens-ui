import React, { useState } from "react";
import { Box, Typography, Paper, Chip, IconButton, Collapse, Link } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function NewsItem({ news }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        backgroundColor: "#1a1b1e",
        border: "1px solid #333",
        borderRadius: 2,
        "&:hover": { borderColor: "#10a37f" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "#10a37f", fontWeight: "bold", flex: 1, cursor: "pointer" }}
          onClick={() => setExpanded(!expanded)}
        >
          {news.title || "Untitled News"}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            color: "#888",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>

      {news.summary && !expanded && (
        <Typography
          variant="body2"
          sx={{
            color: "#bbb",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {news.summary}
        </Typography>
      )}

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {news.summary && (
            <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
              {news.summary}
            </Typography>
          )}
          {news.url && (
            <Link
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "#10a37f",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Read full article
              <OpenInNewIcon sx={{ fontSize: "1rem" }} />
            </Link>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
