import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
// ... (all your icon imports)

// navConfig remains the same...

function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }) {
  const { user } = useAuth();
  
  // *** THE FIX: Correctly access the nested role property ***
  const userRole = user?.role?.roleName?.toUpperCase() || 'GUEST';
  const navItems = navConfig[userRole] || [];

  // ... (the rest of your Sidebar component code remains the same)
  // ...
}

export default Sidebar;