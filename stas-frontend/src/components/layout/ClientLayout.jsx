import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import ClientSidebar from './ClientSidebar';
import Navbar from './Navbar'; // We can reuse the same Navbar
import Footer from './Footer';

const drawerWidth = 240;

const ClientLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar drawerWidth={drawerWidth} onDrawerToggle={() => {}} /> {/* Toggle is for mobile manager view, can be disabled here */}
      <ClientSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}><Outlet /></Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default ClientLayout;