// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  Box, Button, Container, TextField, Typography, CircularProgress,
  Alert, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await authService.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4">
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField name="name" label="Full Name" required fullWidth autoFocus margin="normal" value={formData.name} onChange={handleChange} />
          <TextField name="email" label="Email Address" type="email" required fullWidth margin="normal" value={formData.email} onChange={handleChange} />
          <TextField name="password" label="Password" type="password" required fullWidth margin="normal" value={formData.password} onChange={handleChange} />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-select-label">I am a...</InputLabel>
            <Select labelId="role-select-label" name="roleId" value={formData.roleId} label="I am a..." onChange={handleChange}>
              {/* Values must match your backend `roles` table IDs */}
              <MenuItem value={2}>Client</MenuItem>
              <MenuItem value={3}>Manager</MenuItem>
              <MenuItem value={4}>Developer</MenuItem>
            </Select>
          </FormControl>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;