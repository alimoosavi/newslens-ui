import React from 'react';
import { Box, keyframes } from '@mui/material';

// Animated dots loader
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export function DotsLoader({ size = 8, color = '#00d4aa' }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            animation: `${bounce} 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );
}

// Pulse loader for buttons
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export function PulseLoader({ size = 20, color = '#00d4aa' }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        animation: `${pulse} 1s ease-in-out infinite`,
      }}
    />
  );
}

// Spinner loader
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export function SpinnerLoader({ size = 24, color = '#00d4aa', thickness = 2 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        border: `${thickness}px solid rgba(255, 255, 255, 0.1)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: `${spin} 0.8s linear infinite`,
      }}
    />
  );
}

// Skeleton loader
export function Skeleton({ width, height, borderRadius = 8, ...props }) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: `${borderRadius}px`,
        background: `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.04) 25%,
          rgba(255, 255, 255, 0.08) 50%,
          rgba(255, 255, 255, 0.04) 75%
        )`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        ...props.sx,
      }}
      {...props}
    />
  );
}

// Full page loader
export function PageLoader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0b0e',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          fontSize: '2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #00d4aa, #00e5bf)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3,
        }}
      >
        لنز اخبار
      </Box>
      <DotsLoader size={10} />
    </Box>
  );
}

export default {
  DotsLoader,
  PulseLoader,
  SpinnerLoader,
  Skeleton,
  PageLoader,
};