import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1, 
          p: 3,
          minHeight: '100vh', // Ensure layout takes full screen height
        }}
      >
        <Toolbar /> {/* This is a spacer to push content below the fixed Navbar */}
        
        {/* The page content will be rendered here */}
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        
        {/* Footer is placed at the bottom of the content area */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;