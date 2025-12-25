import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import api from '../../api';
import { STRINGS, getRelativeTime, toPersianNumber } from '../../constants/strings';
import { SpinnerLoader } from '../common/Loaders';

export default function SessionsNavbar({
  sessions = [],
  setSessions,
  activeSession,
  onSelectSession,
  onLogout,
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleNewChat = async () => {
    setCreating(true);
    try {
      const res = await api.post('/api/sessions/', {});
      const newSession = res.data;
      setSessions((prev) => [newSession, ...(Array.isArray(prev) ? prev : [])]);
      onSelectSession(newSession);
    } catch (err) {
      console.error('Failed to create session:', err);
      alert(STRINGS.ERRORS.SESSION_CREATE);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(STRINGS.CHAT.DELETE_CONFIRM)) return;

    setDeletingId(id);
    try {
      await api.delete(`/api/sessions/${id}/`);
      setSessions((prev) => (Array.isArray(prev) ? prev.filter((s) => s.id !== id) : []));
      if (activeSession?.id === id) {
        onSelectSession(null);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert(STRINGS.ERRORS.SESSION_DELETE);
    } finally {
      setDeletingId(null);
    }
  };

  const sessionsList = Array.isArray(sessions) ? sessions : [];

  return (
    <Box
      sx={{
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0f1014 0%, #0a0b0e 100%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
        height: '100%',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00d4aa 0%, #00e5bf 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {STRINGS.APP_NAME}
          </Typography>
          <Tooltip title={STRINGS.AUTH.SIGN_OUT} placement="bottom">
            <IconButton
              onClick={onLogout}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      {/* New Chat Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={creating}
            onClick={handleNewChat}
            startIcon={creating ? null : <AddIcon />}
            sx={{
              py: 1.3,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
              boxShadow: '0 4px 20px rgba(0, 212, 170, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00e5bf 0%, #00d4aa 100%)',
                boxShadow: '0 6px 24px rgba(0, 212, 170, 0.35)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {creating ? (
              <SpinnerLoader size={20} color="rgba(255,255,255,0.5)" />
            ) : (
              STRINGS.CHAT.NEW_CHAT
            )}
          </Button>
        </Box>
      </motion.div>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.04)' }} />

      {/* Sessions List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          py: 1,
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          },
        }}
      >
        {sessionsList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(0, 212, 170, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: '#00d4aa' }} />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                {STRINGS.CHAT.NO_SESSIONS}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {STRINGS.CHAT.START_HINT}
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {sessionsList.map((s, index) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  layout
                >
                  <ListItem
                    selected={activeSession?.id === s.id}
                    onClick={() => onSelectSession(s)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      mb: 0.5,
                      px: 2,
                      py: 1.5,
                      transition: 'all 200ms ease',
                      background: activeSession?.id === s.id
                        ? 'rgba(0, 212, 170, 0.1)'
                        : 'transparent',
                      borderRight: activeSession?.id === s.id
                        ? '3px solid #00d4aa'
                        : '3px solid transparent',
                      '&:hover': {
                        background: activeSession?.id === s.id
                          ? 'rgba(0, 212, 170, 0.12)'
                          : 'rgba(255, 255, 255, 0.04)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        s.title ||
                        `${STRINGS.CHAT.SESSION_PREFIX} ${toPersianNumber(s.id.slice(0, 6))}`
                      }
                      secondary={getRelativeTime(s.updated_at)}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          fontSize: '0.9rem',
                          fontWeight: activeSession?.id === s.id ? 600 : 400,
                          color: activeSession?.id === s.id ? '#00d4aa' : 'text.primary',
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          fontSize: '0.75rem',
                          color: 'text.disabled',
                          mt: 0.3,
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      disabled={deletingId === s.id}
                      onClick={(e) => handleDelete(s.id, e)}
                      sx={{
                        color: 'text.disabled',
                        opacity: 0.6,
                        mr: -1,
                        transition: 'all 200ms ease',
                        '&:hover': {
                          color: '#ef4444',
                          opacity: 1,
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        },
                      }}
                    >
                      {deletingId === s.id ? (
                        <SpinnerLoader size={16} color="#6b7080" />
                      ) : (
                        <DeleteOutlineIcon fontSize="small" />
                      )}
                    </IconButton>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'text.disabled',
          }}
        >
          {STRINGS.APP_TAGLINE}
        </Typography>
      </Box>
    </Box>
  );
}