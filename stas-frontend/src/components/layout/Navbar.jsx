import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ drawerWidth, onDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <TaskAltIcon sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          STAS
        </Typography>
        <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
          Welcome, {user?.name || 'Guest'}
        </Typography>
        <Box>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error"><NotificationsIcon /></Badge>
          </IconButton>
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ mt: '45px' }}>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;