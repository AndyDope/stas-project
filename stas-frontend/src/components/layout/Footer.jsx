import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ mt: 'auto', p: 2, backgroundColor: 'background.paper', borderTop: '1px solid #E5E7EB' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'© '}
        {new Date().getFullYear()}
        {' STAS - Skill-based Task Allocation System. All Rights Reserved.'}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link color="inherit" href="/admin/login">
          Admin Portal
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;