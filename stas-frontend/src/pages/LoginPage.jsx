// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We use the hook
import {
  Box, Button, Container, TextField, Typography, CircularProgress, Alert, Paper
} from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth(); // Get the login function from our context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // THIS IS THE CORRECT, SIMPLIFIED HANDLESUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // The only job of this function is to attempt the login.
      // It does NOT handle navigation. The routing components will do that
      // automatically when the authentication state changes.
      await login(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      setIsLoading(false); // Make sure to stop loading on error
    }
    // Note: We do not set isLoading to false in the success case,
    // because the page will be unmounted by the redirect anyway.
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4">Sign In</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal" required fullWidth id="email"
            label="Email Address" name="email" autoComplete="email"
            autoFocus value={formData.email} onChange={handleChange}
          />
          <TextField
            margin="normal" required fullWidth name="password"
            label="Password" type="password" id="password"
            autoComplete="current-password" value={formData.password} onChange={handleChange}
          />
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          <Box textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                Sign Up
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link to="/admin/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Admin Portal
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;