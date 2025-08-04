import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/projects/KanbanBoard";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RateReviewIcon from "@mui/icons-material/RateReview"; // New Icon
import TaskFeedbackModal from "../components/projects/TaskFeedbackModal"; // Import the modal

const ProjectDetailPage = () => {
	const { projectId } = useParams();
	const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

	// Mock data - replace with API calls
	const project = { title: "New Mobile App", description: "..." };
	const projectTasks = [
		{ id: 1, title: "Setup database schema", status: "Done" },
		{ id: 2, title: "Create login API", status: "In Review" },
	];
	const projectMembers = [
		{ id: 13, name: "Developer Alice" },
		{ id: 14, name: "Developer Bob" },
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
				{/* This button opens the new feedback modal */}
				<Button
					variant="outlined"
					startIcon={<RateReviewIcon />}
					onClick={() => setFeedbackModalOpen(true)}
				>
					Give Feedback
				</Button>
				<Button variant="contained" startIcon={<AddTaskIcon />}>
					Create Task
				</Button>
			</Box>
			<Paper elevation={3} sx={{ p: { xs: 1, sm: 2 } }}>
				<KanbanBoard initialTasks={projectTasks} />
			</Paper>

			{/* The Modal component is here, but invisible until opened */}
			<TaskFeedbackModal
				open={feedbackModalOpen}
				onClose={() => setFeedbackModalOpen(false)}
				tasks={projectTasks}
				members={projectMembers}
			/>
		</Box>
	);
};

export default ProjectDetailPage;
