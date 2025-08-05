import React, { useEffect, useState } from "react";
import {
	Box,
	Grid,
	Paper,
	Typography,
	List,
	ListItem,
	ListItemText,
	Divider,
	CircularProgress,
	Alert,
	Chip,
} from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";
import adminDashboardService from "../services/adminDashboardService";

// *** THIS IS THE STYLING LOGIC COPIED FROM ProjectListItem.jsx ***
// It provides the custom background colors for the status badges.
const getStatusChipStyles = (status) => {
	const style = {
		color: "#fff", // White text for good contrast
		fontWeight: "bold",
	};
	switch (status) {
		case "COMPLETED":
			style.backgroundColor = "#10B981"; // Green
			break;
		case "ONGOING":
			style.backgroundColor = "#3B82F6"; // Blue
			break;
		case "PENDING":
			style.backgroundColor = "#F59E0B"; // Amber
			break;
		case "DELAYED":
		case "AT RISK":
			style.backgroundColor = "#EF4444"; // Red
			break;
		case "ONHOLD":
			style.backgroundColor = "#6B7286"; // Medium Gray
			break;
		default:
			style.backgroundColor = "#9E9E9E"; // A neutral gray
			break;
	}
	return style;
};

const AdminDashboardPage = () => {
	const [stats, setStats] = useState(null);
	const [recentProjects, setRecentProjects] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await adminDashboardService.getAdminDashboardStats();
				setStats(response.data.stats);
				setRecentProjects(response.data.recentProjects);
			} catch (err) {
				setError("Failed to load admin dashboard data.");
				console.error("Error fetching dashboard data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}
	var chartData = {
		developers: stats.userRoleDistribution.DEVELOPER || 0,
		managers: stats.userRoleDistribution.MANAGER || 0,
		clients: stats.userRoleDistribution.CLIENT || 0,
		admins: stats.userRoleDistribution.ADMIN || 0,
	};

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Admin Dashboard
			</Typography>

			<Grid container spacing={3}>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Total Users"
						value={stats.totalUsers}
						icon={<PeopleIcon color="primary" />}
					/>
				</Grid>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Total Projects"
						value={stats.totalProjects}
						icon={<AccountTreeIcon color="primary" />}
					/>
				</Grid>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Tasks Completed"
						value={stats.taskCompleted}
						icon={<AssignmentTurnedInIcon color="success" />}
					/>
				</Grid>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Skills Defined"
						value={stats.skillsDefined}
						icon={<BuildIcon color="primary" />}
					/>
				</Grid>
			</Grid>
			{/* <Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6">User Role Distribution</Typography>
						<ProjectStatusChart
							data={{
								total: stats.totalUsers,
								active: developerCount,
								completed: managerCount,
								overdue: clientCount + adminCount, // group client + admin for "overdue" placeholder
							}}
						/>
					</Paper>
				</Grid> */}

			{/* <Grid item xs={12} md={5}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6" gutterBottom>
							Recent Activity
						</Typography>
						<List>
							{recentActivity.map((item, index) => (
								<React.Fragment key={item.id}>
									<ListItem>
										<ListItemText primary={item.text} />
									</ListItem>
									{index < recentActivity.length - 1 && <Divider />}
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid> */}
			<Grid container spacing={3} sx={{ mt: 3 }}>
				<Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<Paper sx={{ p: 2, pb: 6, height: 380 }}>
						<Typography variant="h6">User Role Distribution</Typography>
						<ProjectStatusChart data={chartData} label={" total users"} />
					</Paper>
				</Grid>

				<Grid size={{ xs: 12, md: 6, lg: 5 }}>
					<Paper
						sx={{ p: 2, height: 380, display: "flex", flexDirection: "column" }}
					>
						<Typography variant="h6" gutterBottom>
							Recent Projects
						</Typography>
						<List sx={{ overflow: "auto" }}>
							{recentProjects.map((project, index) => (
								<React.Fragment key={project.id}>
									<ListItem
										secondaryAction={
											// *** THIS IS THE CHANGE ***
											// We replace the `color` prop with the `sx` prop
											// and use our new styling function.
											<Chip
												label={project.status}
												size="small"
												sx={getStatusChipStyles(project.status)}
											/>
										}
									>
										<ListItemText
											primary={project.title}
											sx={{
												marginRight: "120px",
												"& .MuiListItemText-primary": {
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis",
												},
											}}
										/>
									</ListItem>
									{index < recentProjects.length - 1 && (
										<Divider component="li" />
									)}
								</React.Fragment>
							))}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AdminDashboardPage;
