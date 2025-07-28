import React from "react";
import {
	Box,
	Grid,
	Paper,
	Typography,
	List,
	ListItem,
	ListItemText,
	Divider,
} from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart"; // Reusing the chart

// Import Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const DeveloperDashboardPage = () => {
	// Mock data - replace with API calls
	const stats = { myTasks: 10, overdue: 1, completed: 35, pending: 5 };
	const oldestTasks = [
		{ id: 1, title: "Fix critical login bug" },
		{ id: 2, title: "Refactor the API service layer" },
		{ id: 3, title: "Update documentation for v1.2" },
		{ id: 4, title: "Investigate performance issue" },
		{ id: 5, title: "Deploy latest changes to staging" },
	];

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Developer Dashboard
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="My Tasks"
						value={stats.myTasks}
						icon={<AssignmentIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Overdue Tasks"
						value={stats.overdue}
						icon={<ReportProblemIcon color="error" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Completed Tasks"
						value={stats.completed}
						icon={<CheckCircleOutlineIcon color="success" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Pending Tasks"
						value={stats.pending}
						icon={<PendingActionsIcon color="warning" />}
					/>
				</Grid>

				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6">Task Status Overview</Typography>
						<ProjectStatusChart
							data={{
								total: stats.myTasks,
								active: stats.pending,
								completed: stats.completed,
								overdue: stats.overdue,
							}}
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={5}>
					<Paper
						sx={{ p: 2, height: 380, display: "flex", flexDirection: "column" }}
					>
						<Typography variant="h6" gutterBottom>
							5 Oldest Pending Tasks
						</Typography>
						<List sx={{ overflow: "auto" }}>
							{oldestTasks.map((task, index) => (
								<React.Fragment key={task.id}>
									<ListItem>
										<ListItemText primary={task.title} />
									</ListItem>
									{index < oldestTasks.length - 1 && <Divider />}
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default DeveloperDashboardPage;
