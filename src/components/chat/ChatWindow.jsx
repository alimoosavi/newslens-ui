import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../../api';
import { STRINGS, formatPersianTime } from '../../constants/strings';
import { DotsLoader, SpinnerLoader } from '../common/Loaders';
import NewsItem from './NewsItem';

export default function ChatWindow({ activeSession, setActiveSession, sessions, setSessions }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const messagesContainerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Fetch messages
  useEffect(() => {
    if (!activeSession?.id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setFetchingHistory(true);
      try {
        const res = await api.get(`/api/sessions/${activeSession.id}/messages/`);
        let msgs = [];
        if (Array.isArray(res.data)) {
          msgs = res.data;
        } else if (res.data.messages) {
          msgs = res.data.messages;
        } else if (res.data.results) {
          msgs = res.data.results;
        }

        const formattedMessages = msgs.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          news: msg.news_items || msg.sources || [],
          created_at: msg.created_at,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setMessages([]);
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchMessages();
  }, [activeSession?.id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMsg = {
      role: 'user',
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    setNewMessage('');
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    let sessionId = activeSession?.id;

    // Create new session if needed
    if (!sessionId) {
      try {
        const res = await api.post('/api/sessions/', {});
        const newSession = res.data;
        sessionId = newSession.id;
        setActiveSession(newSession);
        setSessions((prev) => [newSession, ...(Array.isArray(prev) ? prev : [])]);
      } catch (err) {
        console.error('Failed to create session:', err);
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        alert(STRINGS.ERRORS.SESSION_CREATE);
        return;
      }
    }

    // Send message
    try {
      const res = await api.post(`/api/sessions/${sessionId}/chat/`, {
        message: userMsg.content,
      });

      const assistantMsg = {
        id: res.data.message_id || Date.now(),
        role: 'assistant',
        content: res.data.response,
        news: res.data.news_items || res.data.sources || [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      setSessions((prev) =>
        (Array.isArray(prev) ? prev : []).map((s) =>
          s.id === sessionId ? { ...s, updated_at: new Date().toISOString() } : s
        )
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => prev.slice(0, -1));
      alert(STRINGS.ERRORS.MESSAGE_SEND);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(0, 212, 170, 0.03) 0%, transparent 50%),
          #0a0b0e
        `,
        position: 'relative',
      }}
    >
      {/* Messages Container */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 3,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
            },
          },
        }}
      >
        {fetchingHistory && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <SpinnerLoader size={28} color="#00d4aa" />
          </Box>
        )}

        {/* Empty State */}
        {!fetchingHistory && messages.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              textAlign: 'center',
              px: 3,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Logo Animation */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(99, 102, 241, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 0 60px rgba(0, 212, 170, 0.15)',
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 48, color: '#00d4aa' }} />
                </Box>
              </motion.div>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00e5bf 50%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                {STRINGS.CHAT.EMPTY_STATE_TITLE}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', maxWidth: 400, mb: 1 }}
              >
                {STRINGS.CHAT.EMPTY_STATE_DESC}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {STRINGS.CHAT.EMPTY_STATE_HINT}
              </Typography>
            </motion.div>
          </Box>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                  mb: 3,
                  gap: 1.5,
                }}
              >
                {/* Avatar for User */}
                {msg.role === 'user' && (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PersonOutlineIcon sx={{ fontSize: 20, color: '#fff' }} />
                  </Box>
                )}

                {/* Message Content */}
                <Box
                  sx={{
                    maxWidth: msg.role === 'user' ? '70%' : '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      px: 2.5,
                      borderRadius: 3,
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: msg.role === 'user'
                        ? '1px solid rgba(99, 102, 241, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.06)',
                      color: 'text.primary',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </Box>

                  {/* Timestamp */}
                  {msg.created_at && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        px: 1,
                        color: 'text.disabled',
                        fontSize: '0.7rem',
                      }}
                    >
                      {formatPersianTime(msg.created_at)}
                    </Typography>
                  )}

                  {/* News Items */}
                  {msg.role === 'assistant' && msg.news && msg.news.length > 0 && (
                    <Box sx={{ mt: 2, width: '100%' }}>
                      {msg.news.map((n, i) => (
                        <NewsItem key={i} news={n} index={i} />
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Avatar for Assistant */}
                {msg.role === 'assistant' && (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #00d4aa, #00b894)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <SmartToyOutlinedIcon sx={{ fontSize: 20, color: '#fff' }} />
                  </Box>
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  px: 3,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {STRINGS.CHAT.THINKING}
                </Typography>
                <DotsLoader size={6} />
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #00d4aa, #00b894)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SmartToyOutlinedIcon sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(10, 11, 14, 0.9)',
          backdropFilter: 'blur(10px)',
          p: 2.5,
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            mx: 'auto',
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-end',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={STRINGS.CHAT.TYPE_MESSAGE}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 250ms ease',
                '&:hover': {
                  borderColor: 'rgba(0, 212, 170, 0.3)',
                },
                '&.Mui-focused': {
                  borderColor: '#00d4aa',
                  backgroundColor: 'rgba(0, 212, 170, 0.03)',
                  boxShadow: '0 0 0 3px rgba(0, 212, 170, 0.1)',
                },
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                py: 1.5,
                color: 'text.primary',
                '&::placeholder': {
                  color: 'text.disabled',
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || !newMessage.trim()}
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(0, 212, 170, 0.3)',
              transition: 'all 250ms ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #00e5bf 0%, #00d4aa 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 212, 170, 0.4)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'text.disabled',
                boxShadow: 'none',
              },
            }}
          >
            <SendIcon sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1.5,
            color: 'text.disabled',
          }}
        >
          {STRINGS.CHAT.SHIFT_ENTER_HINT}
        </Typography>
      </Box>
    </Box>
  );
}