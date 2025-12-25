import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import api from '../../api';
import { API_ENDPOINTS } from '../../constants/endpoints';
import { STRINGS } from '../../constants/strings';
import { SpinnerLoader } from '../common/Loaders';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username.trim()) {
      setError(STRINGS.VALIDATION.REQUIRED_FIELD);
      return false;
    }
    if (username.length < 3) {
      setError(STRINGS.VALIDATION.USERNAME_MIN);
      return false;
    }
    if (!email.trim()) {
      setError(STRINGS.VALIDATION.REQUIRED_FIELD);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(STRINGS.VALIDATION.INVALID_EMAIL);
      return false;
    }
    if (!password) {
      setError(STRINGS.VALIDATION.REQUIRED_FIELD);
      return false;
    }
    if (password.length < 8) {
      setError(STRINGS.VALIDATION.PASSWORD_MIN);
      return false;
    }
    if (password !== confirmPassword) {
      setError(STRINGS.VALIDATION.PASSWORD_MISMATCH);
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post(API_ENDPOINTS.AUTH_REGISTER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(STRINGS.SUCCESS.ACCOUNT_CREATED);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.username) {
          setError(`نام کاربری: ${errors.username[0]}`);
        } else if (errors.email) {
          setError(`ایمیل: ${errors.email[0]}`);
        } else if (errors.password) {
          setError(`رمز عبور: ${errors.password[0]}`);
        } else if (errors.detail) {
          setError(errors.detail);
        } else {
          setError(STRINGS.VALIDATION.REGISTRATION_FAILED);
        }
      } else {
        setError(STRINGS.VALIDATION.REGISTRATION_FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSignup();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse at 80% 20%, rgba(0, 212, 170, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
          #0a0b0e
        `,
        p: 2,
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '15%',
          left: '10%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 170, 0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 5,
            borderRadius: 4,
            background: 'rgba(18, 20, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00e5bf 50%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {STRINGS.APP_NAME}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {STRINGS.AUTH.JOIN_US}
              </Typography>
            </Box>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert
                  severity="error"
                  onClose={() => setError('')}
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    '& .MuiAlert-message': { color: '#f87171' },
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert
                  severity="success"
                  icon={<CheckCircleOutlineIcon />}
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(0, 212, 170, 0.1)',
                    border: '1px solid rgba(0, 212, 170, 0.2)',
                    '& .MuiAlert-message': { color: '#00d4aa' },
                  }}
                >
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <TextField
                fullWidth
                label={STRINGS.AUTH.USERNAME}
                value={formData.username}
                onChange={handleChange('username')}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TextField
                fullWidth
                label={STRINGS.AUTH.EMAIL}
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <TextField
                fullWidth
                label={STRINGS.AUTH.PASSWORD}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <TextField
                fullWidth
                label={STRINGS.AUTH.CONFIRM_PASSWORD}
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={handleSignup}
                disabled={loading || success}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00e5bf 0%, #00d4aa 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpinnerLoader size={20} color="#fff" />
                    <span>{STRINGS.AUTH.CREATING_ACCOUNT}</span>
                  </Box>
                ) : success ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon />
                    <span>{STRINGS.SUCCESS.REDIRECTING}</span>
                  </Box>
                ) : (
                  STRINGS.AUTH.CREATE_ACCOUNT
                )}
              </Button>
            </motion.div>
          </Box>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}
            >
              {STRINGS.AUTH.HAS_ACCOUNT}{' '}
              <Link
                to="/login"
                style={{
                  color: '#00d4aa',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {STRINGS.AUTH.SIGN_IN}
              </Link>
            </Typography>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Typography
              variant="caption"
              sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.disabled' }}
            >
              {STRINGS.APP_TAGLINE}
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}