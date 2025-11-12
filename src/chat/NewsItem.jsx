import React from "react";
import { Box, Typography, Card, CardContent, CardMedia, Link } from "@mui/material";

export default function NewsItem({ news }) {
  return (
    <Card
      sx={{
        display: "flex",
        mb: 1,
        bgcolor: "#1c1d21",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Image if available */}
      {news.image && (
        <CardMedia
          component="img"
          sx={{ width: 120, objectFit: "cover" }}
          image={news.image}
          alt={news.title}
        />
      )}

      <CardContent sx={{ flex: 1, p: 1.5 }}>
        {/* Title with link */}
        <Typography
          variant="subtitle1"
          sx={{ color: "#10a37f", fontWeight: "bold" }}
        >
          <Link
            href={news.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ color: "inherit" }}
          >
            {news.title}
          </Link>
        </Typography>

        {/* Summary */}
        {news.summary && (
          <Typography variant="body2" sx={{ color: "#e5e5e5", mt: 0.5 }}>
            {news.summary}
          </Typography>
        )}

        {/* Meta */}
        <Typography variant="caption" sx={{ color: "#888" }}>
          {news.source || "نامشخص"}{" "}
          {news.published_date
            ? " - " + new Date(news.published_date).toLocaleString()
            : ""}
        </Typography>
      </CardContent>
    </Card>
  );
}
