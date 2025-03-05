import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  TextField, Button, Container, Typography, Box, Grid, 
  Link, IconButton, Paper, CircularProgress 
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Bitte alle Felder ausfüllen');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      login(user);
      navigate('/welcome');
    } catch (err) {
      setError(err.response?.data?.message || 'Ein Fehler ist bei der Anmeldung aufgetreten');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2, #bbdefb, #ffffff)',
        padding: '24px'
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 6,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <LockOutlined sx={{ fontSize: 32, color: '#1976d2' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
              Willkommen auf fleet4u.de!
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', textAlign: 'center' }}>
              Bitte geben Sie Ihre Anmeldedaten ein
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { mb: 3 } }}>
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mb: 2, textAlign: 'center',
                  backgroundColor: '#fee2e2',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #fecaca'
                }}
              >
                {error}
              </Typography>
            )}

            <TextField
              fullWidth
              label="E-Mail-Adresse"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: '#F9FAFB',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1976d2' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
              }}
            />

            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Passwort"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
                }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  color: '#6B7280',
                  '&:hover': { color: '#374151' }
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 3,
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Anmelden'}
            </Button>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Link
                  component="button"
                  onClick={() => navigate('/passwort-vergessen')}
                  sx={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline', color: '#1565c0' }
                  }}
                >
                  Passwort vergessen?
                </Link>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Link
                  component="button"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline', color: '#1565c0' }
                  }}
                >
                  Konto erstellen
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;