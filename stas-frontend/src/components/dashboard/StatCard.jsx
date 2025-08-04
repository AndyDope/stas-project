import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, icon }) => {
	return (
		<Paper
			elevation={3}
			sx={{
				p: 2.5,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				height: "100%", // *** THIS IS THE FIX ***
			}}
		>
			<Box>
				<Typography color="text.secondary" gutterBottom>
					{title}
				</Typography>
				<Typography variant="h4" component="div">
					{value}
				</Typography>
			</Box>
			{icon}
		</Paper>
	);
};

export default StatCard;
