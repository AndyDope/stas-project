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
	Chip,
} from "@mui/material";
import StatCard from "../components/dashboard/StatCard";

// Import Icons
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PersonOffIcon from "@mui/icons-material/PersonOff";

const ManagerDashboardPage = () => {
	// Mock data - replace with API calls
	const stats = {
		myProjects: 4,
		teamMembers: 8,
		openTasks: 25,
		overdueTasks: 2,
	};
	const teamWorkload = [
		{ id: 1, name: "Alice", tasks: 8, status: "Overloaded" },
		{ id: 2, name: "Bob", tasks: 2, status: "Underutilized" },
		{ id: 3, name: "Charlie", tasks: 5, status: "Optimal" },
	];
	const highPriorityTasks = [
		{ id: 1, title: "Fix login authentication bug", project: "API Refactor" },
		{
			id: 2,
			title: "Deploy critical patch to production",
			project: "New Mobile App",
		},
	];

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Manager Dashboard
			</Typography>

			{/* KPI Stat Cards */}
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="My Active Projects"
						value={stats.myProjects}
						icon={<AccountTreeIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="My Team Members"
						value={stats.teamMembers}
						icon={<GroupIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Open Tasks"
						value={stats.openTasks}
						icon={<PlaylistPlayIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Overdue Tasks"
						value={stats.overdueTasks}
						icon={<AssignmentLateIcon color="error" />}
					/>
				</Grid>
			</Grid>

			{/* Second Row: More detailed stats */}
			<Grid container spacing={3} sx={{ mt: 1 }}>
				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: "100%" }}>
						<Typography variant="h6" gutterBottom>
							High Priority / Overdue
						</Typography>
						<List>
							{highPriorityTasks.map((task, index) => (
								<React.Fragment key={task.id}>
									<ListItem>
										<ListItemText
											primary={task.title}
											secondary={`Project: ${task.project}`}
										/>
									</ListItem>
									{index < highPriorityTasks.length - 1 && <Divider />}
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid>
				<Grid item xs={12} md={5}>
					<Paper sx={{ p: 2, height: "100%" }}>
						<Typography variant="h6" gutterBottom>
							Team Workload
						</Typography>
						<List>
							{teamWorkload.map((member, index) => (
								<React.Fragment key={member.id}>
									<ListItem
										secondaryAction={
											<Chip
												label={member.status}
												color={
													member.status === "Overloaded"
														? "error"
														: member.status === "Underutilized"
														? "warning"
														: "success"
												}
												size="small"
											/>
										}
									>
										<ListItemText
											primary={member.name}
											secondary={`${member.tasks} tasks assigned`}
										/>
									</ListItem>
									{index < teamWorkload.length - 1 && <Divider />}
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ManagerDashboardPage;
