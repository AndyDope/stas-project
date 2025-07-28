import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/projects/KanbanBoard";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

const ProjectDetailPage = () => {
	const { projectId } = useParams();
	const project = {
		title: "New Mobile App",
		description: "The official app for our new product launch.",
	};

	// Mock data for this specific project - replace with an API call
	const projectTasks = [
		{ id: 1, title: "Setup database schema", status: "Done" },
		{ id: 2, title: "Create login API", status: "In Review" },
		{ id: 3, title: "Build login page UI", status: "In Progress" },
		{ id: 4, title: "Implement JWT", status: "In Progress" },
		{ id: 5, title: "Add project creation form", status: "To Do" },
		{ id: 6, title: "Design the main dashboard", status: "Backlog" },
	];

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4">{project.title}</Typography>
				<Typography color="text.secondary">{project.description}</Typography>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
				<Button variant="outlined" startIcon={<PeopleOutlineIcon />}>
					Manage Team
				</Button>
				<Button variant="contained" startIcon={<AddTaskIcon />}>
					Create Task
				</Button>
			</Box>
			<Paper elevation={3} sx={{ p: { xs: 1, sm: 2 } }}>
				<KanbanBoard initialTasks={projectTasks} />
			</Paper>
		</Box>
	);
};

export default ProjectDetailPage;
