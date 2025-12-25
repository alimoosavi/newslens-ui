import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatPersianDate, getRelativeTime } from '../../constants/strings';

export default function NewsItem({ news, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box
        component="a"
        href={news.link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'block',
          p: 2.5,
          mb: 1.5,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          textDecoration: 'none',
          transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 3,
            height: '100%',
            background: 'linear-gradient(180deg, #00d4aa, #00b894)',
            opacity: 0,
            transition: 'opacity 300ms ease',
          },
          '&:hover': {
            background: 'rgba(0, 212, 170, 0.04)',
            borderColor: 'rgba(0, 212, 170, 0.2)',
            transform: 'translateX(-4px)',
            '&::before': {
              opacity: 1,
            },
          },
        }}
      >
        {/* Title Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: '#f0f2f5',
              fontWeight: 600,
              lineHeight: 1.6,
              flex: 1,
              transition: 'color 200ms ease',
              '.MuiBox-root:hover &': {
                color: '#00d4aa',
              },
            }}
          >
            {news.title}
          </Typography>
          <OpenInNewIcon
            sx={{
              color: 'text.disabled',
              fontSize: 18,
              flexShrink: 0,
              mt: 0.5,
              transition: 'all 200ms ease',
              '.MuiBox-root:hover &': {
                color: '#00d4aa',
                transform: 'translate(2px, -2px)',
              },
            }}
          />
        </Box>

        {/* Summary */}
        {news.summary && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.8,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {news.summary}
          </Typography>
        )}

        {/* Meta Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {news.source && (
            <Chip
              label={news.source}
              size="small"
              sx={{
                height: 26,
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: 'rgba(0, 212, 170, 0.1)',
                color: '#00d4aa',
                border: '1px solid rgba(0, 212, 170, 0.2)',
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          )}
          {news.published_datetime && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.disabled',
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                {getRelativeTime(news.published_datetime)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}