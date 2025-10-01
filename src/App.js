import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useAuth from './auth/useAuth';
import api from './api';
import AuthPage from './auth/AuthPage';
import ChatLayout from './chat/ChatLayout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b5cff' },
    secondary: { main: '#00a884' },
  }
});

export default function App() {
  const { user, setUserFromToken, saveTokens, clear } = useAuth();
  const [authed, setAuthed] = useState(!!localStorage.getItem('access'));

  useEffect(()=>{
    async function fetchStatus(){
      try{
        const res = await api.get('/auth/status/');
        if(res.data){
          setUserFromToken(res.data);
          setAuthed(true);
        }
      }catch{}
    }
    if(localStorage.getItem('access') && !localStorage.getItem('user')) fetchStatus();
  },[]);

  function handleAuthenticated(tokenResponse){
    saveTokens(tokenResponse);
    try{
      const payload = JSON.parse(atob(tokenResponse.access.split('.')[1]));
      setUserFromToken(payload);
    }catch{
      api.get('/auth/status/').then(r=> setUserFromToken(r.data)).catch(()=>{});
    }
    setAuthed(true);
  }

  function handleLogout(){
    clear();
    setAuthed(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {authed ? (
        <ChatLayout apiClient={api} onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthenticated={handleAuthenticated} />
      )}
    </ThemeProvider>
  );
}