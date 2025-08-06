// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6', // Corporate Blue
    },
    secondary: {
      main: '#6B7286', // Medium Gray
    },
    background: {
      default: '#F8F9FA', // Off-White
      paper: '#FFFFFF',   // Card White
    },
    text: {
      primary: '#1F2937',   // Dark Gray
      secondary: '#6B7286', // Medium Gray
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    button: {
      textTransform: 'none', // No more ALL CAPS buttons
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8, // Global border radius
  },
});