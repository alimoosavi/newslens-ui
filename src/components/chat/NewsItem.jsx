import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function NewsItem({ news, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Box
        component="a"
        href={news.link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "block",
          p: 2,
          bgcolor: "#1a1b1f",
          borderRadius: 2,
          border: "1px solid #2a2a2a",
          textDecoration: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: "#222",
            borderColor: "#10a37f",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(16, 163, 127, 0.15)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#10a37f",
              fontWeight: 600,
              flex: 1,
              lineHeight: 1.4,
            }}
          >
            {news.title}
          </Typography>
          <OpenInNewIcon sx={{ color: "#666", fontSize: 16, flexShrink: 0, mt: 0.3 }} />
        </Box>

        {news.summary && (
          <Typography
            variant="body2"
            sx={{
              color: "#bbb",
              fontSize: "0.85rem",
              mb: 1.5,
              lineHeight: 1.5,
            }}
          >
            {news.summary}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {news.source && (
            <Chip
              label={news.source}
              size="small"
              sx={{
                bgcolor: "#2a2a2a",
                color: "#aaa",
                fontSize: "0.75rem",
                height: 24,
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          )}
          {news.published_datetime && (
            <Typography variant="caption" sx={{ color: "#666" }}>
              {new Date(news.published_datetime).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
