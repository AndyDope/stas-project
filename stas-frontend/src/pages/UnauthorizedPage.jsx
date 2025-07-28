import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom"; // Use Link for internal navigation

const UnauthorizedPage = () => (
	<Box sx={{ textAlign: "center", mt: 8, p: 3 }}>
		<Typography variant="h3" color="error">
			Access Denied
		</Typography>
		<Typography sx={{ mt: 2 }}>
			You do not have the necessary permissions to view this page.
		</Typography>

		{/* This now correctly links to the root, which will be handled by DashboardRedirect */}
		<Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
			Go to My Dashboard
		</Button>
	</Box>
);

export default UnauthorizedPage;
