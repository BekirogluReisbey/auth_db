import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  TextField, Button, Container, Typography, Box, Grid, 
  Link, IconButton, Paper, CircularProgress, FormControl,
  FormControlLabel, Radio, RadioGroup, FormLabel
} from '@mui/material';
import { PersonAddOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user', // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { name, email, password, password2, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validations
    if (!name || !email || !password || !password2) {
      setError('Bitte alle Felder ausfüllen');
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password, role },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      login(user);
      navigate('/welcome');
    } catch (err) {
      setError(err.response?.data?.message || 'Ein Fehler ist bei der Registrierung aufgetreten');
      console.error('Registration error:', err);
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
              <PersonAddOutlined sx={{ fontSize: 32, color: '#1976d2' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
              Konto erstellen
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', textAlign: 'center' }}>
              Erstellen Sie Ihr persönliches fleet4u.de Konto
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
              label="Name"
              name="name"
              variant="outlined"
              value={name}
              onChange={onChange}
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

            <TextField
              fullWidth
              label="E-Mail-Adresse"
              name="email"
              type="email"
              variant="outlined"
              value={email}
              onChange={onChange}
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={onChange}
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

            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Passwort bestätigen"
                name="password2"
                type={showPassword2 ? 'text' : 'password'}
                variant="outlined"
                value={password2}
                onChange={onChange}
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
                onClick={() => setShowPassword2(!showPassword2)}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  color: '#6B7280',
                  '&:hover': { color: '#374151' }
                }}
              >
                {showPassword2 ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend" sx={{ color: '#4B5563', mb: 1 }}>Rolle auswählen</FormLabel>
              <RadioGroup
                row
                name="role"
                value={role}
                onChange={onChange}
              >
                <FormControlLabel 
                  value="user" 
                  control={<Radio sx={{ color: '#1976d2', '&.Mui-checked': { color: '#1976d2' } }} />} 
                  label="Benutzer" 
                  sx={{ mr: 3 }}
                />
                <FormControlLabel 
                  value="supervisor" 
                  control={<Radio sx={{ color: '#1976d2', '&.Mui-checked': { color: '#1976d2' } }} />} 
                  label="Supervisor" 
                  sx={{ mr: 3 }}
                />
                <FormControlLabel 
                  value="admin" 
                  control={<Radio sx={{ color: '#1976d2', '&.Mui-checked': { color: '#1976d2' } }} />} 
                  label="Admin" 
                />
              </RadioGroup>
            </FormControl>

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
              {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Registrieren'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                onClick={() => navigate('/')}
                sx={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline', color: '#1565c0' }
                }}
              >
                Bereits ein Konto? Anmelden
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterForm;