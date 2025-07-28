import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useDragToScroll } from "../../hooks/useDragToScroll"; // Import our custom hook

const columns = ["Backlog", "To Do", "In Progress", "In Review", "Done"];

const TaskCard = ({ task }) => (
	<Paper elevation={2} sx={{ p: 2, mb: 2 }}>
		<Typography>{task.title}</Typography>
	</Paper>
);

const KanbanBoard = ({ initialTasks }) => {
	// Initialize the hook to get the ref
	const scrollRef = useDragToScroll();

	return (
		<Box
			// Attach the ref from our hook to this element
			ref={scrollRef}
			sx={{
				display: "flex",
				gap: 2,
				p: 1,
				pb: 2, // Padding for scrollbar visibility
				overflowX: "auto", // This makes the container scrollable
				cursor: "grab", // Visual cue that it's draggable
				// Hide the default scrollbar for a cleaner look
				"&::-webkit-scrollbar": {
					height: "8px",
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: "rgba(0,0,0,0.2)",
					borderRadius: "4px",
				},
			}}
		>
			{columns.map((columnName) => (
				<Paper
					key={columnName}
					sx={{
						p: 2,
						width: { xs: 280, sm: 300 },
						flexShrink: 0, // Prevents columns from shrinking
						bgcolor: "#F8F9FA",
					}}
				>
					<Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
						{columnName}
					</Typography>
					{initialTasks
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
