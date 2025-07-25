import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ open }) => {
	const navItems = [
		{ text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
		{ text: "My Projects", icon: <AccountTreeIcon />, path: "/projects" },
	];

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: open ? drawerWidth : collapsedWidth,
				flexShrink: 0,
				transition: "width 0.2s",
				[`& .MuiDrawer-paper`]: {
					width: open ? drawerWidth : collapsedWidth,
					boxSizing: "border-box",
					overflowX: "hidden",
					transition: "width 0.2s",
				},
			}}
		>
			<Toolbar />
			<Box sx={{ overflow: "auto" }}>
				<List>
					{navItems.map((item) => (
						<ListItem
							key={item.text}
							disablePadding
							sx={{ justifyContent: open ? "initial" : "center" }}
						>
							<ListItemButton
								component={NavLink}
								to={item.path}
								sx={{
									minHeight: 48,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
									"&.active": {
										backgroundColor: "action.selected",
										fontWeight: "fontWeightBold",
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 2 : "auto",
										justifyContent: "center",
									}}
								>
									{item.icon}
								</ListItemIcon>
								{open && <ListItemText primary={item.text} />}
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
};

export default Sidebar;