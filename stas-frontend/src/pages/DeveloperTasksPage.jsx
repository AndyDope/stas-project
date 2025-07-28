import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import KanbanBoard from "../components/projects/KanbanBoard"; // Reusing the same component

const DeveloperTasksPage = () => {
	// Mock data for tasks assigned to the current developer - replace with an API call
	const myTasks = [
		{ id: 3, title: "Build login page UI", status: "In Progress" },
		{ id: 4, title: "Implement JWT", status: "In Progress" },
		{ id: 7, title: "Fix mobile responsiveness", status: "To Do" },
		{ id: 8, title: "Write unit tests for auth service", status: "Backlog" },
	];

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4">My Tasks</Typography>
				<Typography color="text.secondary">
					All tasks assigned to you across all projects.
				</Typography>
			</Box>
			<Paper elevation={3} sx={{ p: { xs: 1, sm: 2 } }}>
				<KanbanBoard initialTasks={myTasks} />
			</Paper>
		</Box>
	);
};

export default DeveloperTasksPage;
