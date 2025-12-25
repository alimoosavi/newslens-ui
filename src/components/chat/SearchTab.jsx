import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import api from '../../api';
import { API_ENDPOINTS } from '../../constants/endpoints';
import { STRINGS, toPersianNumber } from '../../constants/strings';
import { SpinnerLoader } from '../common/Loaders';
import NewsItem from './NewsItem';

export default function SearchTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.post(API_ENDPOINTS.SEARCH, { query });
      setResults(res.data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      alert(STRINGS.ERRORS.SEARCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: `
          radial-gradient(ellipse at 30% 0%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 100%, rgba(0, 212, 170, 0.03) 0%, transparent 50%),
          #0a0b0e
        `,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TravelExploreIcon sx={{ fontSize: 24, color: '#818cf8' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {STRINGS.SEARCH.TITLE}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {STRINGS.APP_DESCRIPTION}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={STRINGS.SEARCH.PLACEHOLDER}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.03)',
                    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              sx={{
                minWidth: 130,
                borderRadius: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              {loading ? (
                <SpinnerLoader size={20} color="rgba(255,255,255,0.5)" />
              ) : (
                STRINGS.SEARCH.BUTTON
              )}
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Results Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          py: 2,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          },
        }}
      >
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <SpinnerLoader size={36} color="#6366f1" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              {STRINGS.SEARCH.SEARCHING}
            </Typography>
          </Box>
        )}

        {/* Empty Initial State */}
        {!loading && !hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 10,
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <TravelExploreIcon sx={{ fontSize: 40, color: '#818cf8' }} />
                </Box>
              </motion.div>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                جستجوی هوشمند اخبار
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 300 }}>
                عبارت مورد نظر خود را وارد کنید تا اخبار مرتبط را برای شما پیدا کنیم
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 10,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <SentimentDissatisfiedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                {STRINGS.SEARCH.NO_RESULTS}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {STRINGS.SEARCH.TRY_DIFFERENT}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: '#6366f1',
                  fontWeight: 700,
                }}
              >
                {toPersianNumber(results.length)}
              </Box>
              نتیجه یافت شد
            </Typography>
          </motion.div>
        )}

        {/* Results List */}
        <AnimatePresence>
          {results.map((item, idx) => (
            <NewsItem key={idx} news={item} index={idx} />
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}