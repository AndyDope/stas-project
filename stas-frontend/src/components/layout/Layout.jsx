import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const drawerWidth = 240;

function Layout() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Navbar onDrawerToggle={handleDrawerToggle} />
			<Sidebar
				drawerWidth={drawerWidth}
				mobileOpen={mobileOpen}
				onDrawerToggle={handleDrawerToggle}
			/>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					// This is the key: the main content area has a defined width and hides its own overflow.
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					overflowX: "hidden",
				}}
			>
				<Toolbar /> {/* Spacer for the Navbar */}
				{/* This inner box will handle vertical scrolling if content is too tall */}
				<Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
					<Outlet />
				</Box>
				{/* The Footer is now a direct child of the flex column, so it sticks to the bottom */}
				<Footer />
			</Box>
		</Box>
	);
}

export default Layout;
