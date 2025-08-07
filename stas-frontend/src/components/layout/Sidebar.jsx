import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from "@mui/icons-material/People";
import CommentIcon from "@mui/icons-material/Comment";
import AssignmentIcon from "@mui/icons-material/Assignment";

const navConfig = {
  ADMIN: [
    {
      text: "Dashboard",
      icon: <AdminPanelSettingsIcon />,
      path: "/admin/dashboard",
    },
    { text: "User Management", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "My Profile", icon: <SettingsIcon />, path: "/admin/profile" },
  ],
  MANAGER: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/manager/dashboard" },
    {
      text: "My Projects",
      icon: <AccountTreeIcon />,
      path: "/manager/projects",
    },
    {
      text: "All Tasks",
      icon: <AssignmentIcon />,
      path: "/manager/all-tasks",
    },
    {
      text: "Assign Task", // ✅ New menu item
      icon: <AssignmentIcon />,
      path: "/manager/assigntask",
    },
    {
      text: "Edit Task",
      icon: <AssignmentIcon />, // You can change the icon if needed
      path: "/manager/edit-task",
    },
    {
      text: "Feedback",
      icon: <PeopleIcon />, // You can replace this icon if desired
      path: "/manager/feedback",
    },
    {
      text: "Feedbacks Received", // NEW ENTRY
      icon: <CommentIcon />,
      path: "/manager/received-feedbacks",
    },
    { text: "My Profile", icon: <SettingsIcon />, path: "/profile" },
  ],
  CLIENT: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/client/dashboard" },
    {
      text: "My Projects",
      icon: <AccountTreeIcon />,
      path: "/client/projects",
    },
    {
      text: "Create Project",
      icon: <AddCircleOutlineIcon />,
      path: "/client/create-project",
    },
    {
      text: "Give Feedback",
      icon: <RateReviewIcon />,
      path: "/client/feedback",
    },
    { text: "My Profile", icon: <SettingsIcon />, path: "/profile" },
  ],
  DEVELOPER: [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/developer/dashboard",
    },
    { text: "My Tasks", icon: <AccountTreeIcon />, path: "/developer/tasks" },
    {
      text: "Edit My Task", // 👈 New Entry
      icon: <AssignmentIcon />,
      path: "/developer/edit-task",
    },
    {
      text: "Feedbacks", // 👈 ADD THIS
      icon: <CommentIcon />,
      path: "/developer/feedbacks",
    },
    {
      text: "My Profile",
      icon: <SettingsIcon />,
      path: "/developer/myProfile",
    },
  ],
};

function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }) {
  const { user } = useAuth();
  const userRole = user?.role?.roleName?.toUpperCase() || "GUEST";
  const navItems = navConfig[userRole] || [];

  const drawerContent = (
    <div>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => mobileOpen && onDrawerToggle()}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
