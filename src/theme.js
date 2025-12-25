import { createTheme } from '@mui/material/styles';

// تم سفارشی لنز اخبار
const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4aa',
      light: '#33ddbb',
      dark: '#00a888',
      contrastText: '#0a0b0e',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#0a0b0e',
      paper: '#12141a',
    },
    text: {
      primary: '#f0f2f5',
      secondary: '#a0a4ab',
      disabled: '#6b7080',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#00d4aa',
      light: '#34d399',
      dark: '#059669',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Vazirmatn", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.35,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.65,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#6b7080',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.2)',
    '0 4px 8px rgba(0,0,0,0.25)',
    '0 6px 12px rgba(0,0,0,0.3)',
    '0 8px 16px rgba(0,0,0,0.35)',
    '0 10px 20px rgba(0,0,0,0.4)',
    '0 12px 24px rgba(0,0,0,0.45)',
    '0 14px 28px rgba(0,0,0,0.5)',
    '0 16px 32px rgba(0,0,0,0.55)',
    '0 18px 36px rgba(0,0,0,0.6)',
    '0 20px 40px rgba(0,0,0,0.65)',
    '0 22px 44px rgba(0,0,0,0.7)',
    '0 24px 48px rgba(0,0,0,0.75)',
    ...Array(12).fill('0 24px 48px rgba(0,0,0,0.75)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0, 212, 170, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 212, 170, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            transition: 'all 200ms ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 170, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4aa',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 212, 170, 0.05)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6b7080',
            '&.Mui-focused': {
              color: '#00d4aa',
            },
          },
          '& .MuiInputBase-input': {
            color: '#f0f2f5',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#12141a',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1d24',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          minHeight: 56,
          transition: 'all 200ms ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 170, 0.08)',
          },
          '&.Mui-selected': {
            color: '#00d4aa',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#00d4aa',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 4,
          transition: 'all 200ms ease',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundColor: '#1a1d24',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e2128',
          fontSize: '0.8rem',
          borderRadius: 8,
          padding: '8px 12px',
        },
      },
    },
  },
});

export default theme;