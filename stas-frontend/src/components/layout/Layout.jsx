import React from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Navbar />
			<Sidebar />
			<Box
				component="main"
				sx={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
					p: 3,
					width: "100%", // Take up full width of the remaining space
					minHeight: "100vh",
					overflowX: "hidden", // *** CRITICAL FIX: Prevents this container from scrolling horizontally ***
				}}
			>
				<Toolbar />

				<Box sx={{ flexGrow: 1 }}>
					<Outlet />
				</Box>

				<Footer />
			</Box>
		</Box>
	);
};

export default Layout;
