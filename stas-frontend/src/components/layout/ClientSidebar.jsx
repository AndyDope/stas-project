import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const ClientSidebar = () => {
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/client/dashboard' },
    { text: 'My Projects', icon: <FolderSpecialIcon />, path: '/client/projects' },
    { text: 'Create New Project', icon: <AddCircleOutlineIcon />, path: '/client/create-project' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/client/settings' },
  ];

  return (
    <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.path} sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default ClientSidebar;