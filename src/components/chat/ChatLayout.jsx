import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../api';
import { STRINGS } from '../../constants/strings';
import ChatWindow from './ChatWindow';
import SessionsNavbar from './SessionsNavbar';
import SearchTab from './SearchTab';

export default function ChatLayout() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/sessions/');
        const sessionData = Array.isArray(res.data) ? res.data : res.data.results || [];
        setSessions(sessionData);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0b0e',
      }}
    >
      {/* Top Tab Switcher */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            background: 'rgba(15, 16, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, val) => setTab(val)}
            centered
            sx={{
              minHeight: 60,
              '& .MuiTab-root': {
                minHeight: 60,
                minWidth: 140,
                gap: 1,
                color: 'text.secondary',
                transition: 'all 250ms ease',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                },
                '&.Mui-selected': {
                  color: '#00d4aa',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #00d4aa, #00e5bf)',
              },
            }}
          >
            <Tab
              icon={<ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={STRINGS.TABS.CHAT}
            />
            <Tab
              icon={<SearchIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={STRINGS.TABS.SEARCH}
            />
          </Tabs>
        </Box>
      </motion.div>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {tab === 0 ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', width: '100%', height: '100%' }}
            >
              {/* Chat Window (Main Area) */}
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <ChatWindow
                  activeSession={activeSession}
                  setActiveSession={setActiveSession}
                  sessions={sessions}
                  setSessions={setSessions}
                />
              </Box>

              {/* Sidebar (Right side for RTL) */}
              <SessionsNavbar
                sessions={sessions}
                setSessions={setSessions}
                activeSession={activeSession}
                onSelectSession={(session) => setActiveSession(session)}
                onLogout={handleLogout}
              />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', height: '100%' }}
            >
              <SearchTab />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}