import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useDragToScroll } from "../../hooks/useDragToScroll"; // 1. Import our custom hook

const columns = ["Backlog", "To Do", "In Progress", "In Review", "Done"];

const TaskCard = ({ task }) => (
	<Paper
		elevation={2}
		sx={{
			p: 2,
			mb: 2,
			"&:hover": { bgcolor: "action.hover", cursor: "pointer" },
		}}
	>
		<Typography>{task.title}</Typography>
	</Paper>
);

const KanbanBoard = () => {
	// 2. Initialize the hook and get the ref
	const scrollRef = useDragToScroll();

	const tasks = [
		{ id: 1, title: "Setup database schema", status: "Done" },
		{ id: 2, title: "Create login API", status: "In Review" },
		{ id: 3, title: "Build login page UI", status: "In Progress" },
		{ id: 4, title: "Implement JWT", status: "In Progress" },
		{ id: 5, title: "Add project creation form", status: "To Do" },
		{ id: 6, title: "Design the main dashboard", status: "Backlog" },
		{ id: 7, title: "Fix mobile responsiveness", status: "In Progress" },
	];

	return (
		<Box
			// 3. Attach the ref from our hook to this element
			ref={scrollRef}
			sx={{
				display: "flex",
				gap: 2,
				p: 1,
				pb: 2,
				overflowX: "auto", // Keep this for scrollbar visibility and accessibility
				cursor: "grab",
				"&:active": {
					cursor: "grabbing",
				},
				// Prevents the default scrollbar from showing in a cleaner way
				"&::-webkit-scrollbar": {
					display: "none",
				},
				scrollbarWidth: "none", // For Firefox
			}}
		>
			{columns.map((columnName) => (
				<Paper
					key={columnName}
					sx={{
						p: 2,
						width: { xs: 280, sm: 300 },
						flexShrink: 0,
						bgcolor: "#F8F9FA",
					}}
				>
					<Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
						{columnName}
					</Typography>
					{tasks
						.filter((task) => task.status === columnName)
						.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
				</Paper>
			))}
		</Box>
	);
};

export default KanbanBoard;
