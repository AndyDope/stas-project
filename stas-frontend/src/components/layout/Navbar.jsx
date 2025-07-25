import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	IconButton,
	Badge,
	Menu,
	MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import logo from "../../assets/logo.svg";

const Navbar = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		// Add your logout logic from AuthContext here
		handleClose();
	};

	// Import the logo SVG

	return (
		<AppBar
			position="fixed"
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Toolbar>
				<Box
					component="img"
					src={logo}
					alt="STAS Logo"
					sx={{ height: 40, mr: 1 }}
				/>

				<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
					Skill-based Task Allocation System
				</Typography>

				<Box>
					{/* <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
					<IconButton size="large" onClick={handleMenu} color="inherit">
						<AccountCircle />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						transformOrigin={{ vertical: "top", horizontal: "right" }}
						sx={{ mt: "45px" }}
					>
						<MenuItem onClick={handleClose}>Profile</MenuItem>
						<MenuItem onClick={handleLogout}>Logout</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
