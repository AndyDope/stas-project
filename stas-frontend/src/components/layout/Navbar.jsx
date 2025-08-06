import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink for the logo link
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Box,
	Menu,
	MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../context/AuthContext";

// 1. Re-import your logo. Make sure this path is correct relative to Navbar.jsx!
import logo from "../../assets/logo.svg";

function Navbar({ onDrawerToggle }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const open = Boolean(anchorEl);

	const handleMenu = (event) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const handleLogout = () => {
		logout();
		navigate("/login");
		handleClose();
	};

	return (
		<AppBar
			position="fixed"
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={onDrawerToggle}
					sx={{ mr: 2, display: { sm: "none" } }}
				>
					<MenuIcon />
				</IconButton>

				{/* 2. (Optional but Recommended) Wrap logo and title in a link */}
				<Box
					component={NavLink}
					to="/"
					sx={{
						display: "flex",
						alignItems: "center",
						textDecoration: "none",
						color: "inherit",
						flexGrow: 1,
					}}
				>
					{/* 3. Add the logo image back */}
					<Box
						component="img"
						src={logo}
						alt="STAS Logo"
						sx={{ height: 40, mr: 2 }}
					/>
					<Typography
						variant="h6"
						noWrap
						component="div"
						fontFamily={"Courier"}
					>
						Skill-based Task Allocation System
					</Typography>
				</Box>

				<Typography sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
					Welcome, {user?.name || "Guest"}
				</Typography>

				<IconButton size="large" onClick={handleMenu} color="inherit">
					<AccountCircle />
				</IconButton>
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					sx={{ mt: "45px" }}
				>
					<MenuItem component={NavLink} to="/profile" onClick={handleClose}>
						Profile
					</MenuItem>
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
