// import React, { useEffect, useState } from "react";
// import {
// 	Box,
// 	Grid,
// 	Paper,
// 	Typography,
// 	List,
// 	ListItem,
// 	ListItemText,
// 	Divider,
// 	CircularProgress,
// 	Alert,
// } from "@mui/material";

// import StatCard from "../components/dashboard/StatCard";
// import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
// import PeopleIcon from "@mui/icons-material/People";
// import AccountTreeIcon from "@mui/icons-material/AccountTree";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import BuildIcon from "@mui/icons-material/Build";

// import adminDashboardService from "../services/adminDashboardService";

// const AdminDashboardPage = () => {
// 	const [stats, setStats] = useState({
// 		totalUsers: 0,
// 		totalProjects: 0,
// 		tasksCompleted: 0,
// 		skillsDefined: 0,
// 	});
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);

// 	useEffect(() => {
// 		const fetchStats = async () => {
// 			try {
// 				const response = await adminDashboardService.getAdminDashboardStats();
// 				setStats(response.data);
// 			} catch (err) {
// 				console.error("Error loading admin dashboard stats", err);
// 				setError("Could not load dashboard data.");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchStats();
// 	}, []);

// 	if (loading) {
// 		return (
// 			<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
// 				<CircularProgress />
// 			</Box>
// 		);
// 	}

// 	if (error) {
// 		return <Alert severity="error">{error}</Alert>;
// 	}

// 	return (
// 		<Box>
// 			<Typography variant="h4" sx={{ mb: 3 }}>
// 				Admin Dashboard
// 			</Typography>
// 			<Grid container spacing={3}>
// 				<Grid item xs={12} sm={6} md={3}>
// 					<StatCard
// 						title="Total Users"
// 						value={stats.totalUsers}
// 						icon={<PeopleIcon color="primary" />}
// 					/>
// 				</Grid>
// 				<Grid item xs={12} sm={6} md={3}>
// 					<StatCard
// 						title="Total Projects"
// 						value={stats.totalProjects}
// 						icon={<AccountTreeIcon color="primary" />}
// 					/>
// 				</Grid>
// 				<Grid item xs={12} sm={6} md={3}>
// 					<StatCard
// 						title="Tasks Completed"
// 						value={stats.tasksCompleted}
// 						icon={<AssignmentTurnedInIcon color="success" />}
// 					/>
// 				</Grid>
// 				<Grid item xs={12} sm={6} md={3}>
// 					<StatCard
// 						title="Skills Defined"
// 						value={stats.skillsDefined}
// 						icon={<BuildIcon color="primary" />}
// 					/>
// 				</Grid>

// 				<Grid item xs={12} md={7}>
// 					<Paper sx={{ p: 2, height: 380 }}>
// 						<Typography variant="h6">User Role Distribution</Typography>
// 						<ProjectStatusChart
// 							data={{
// 								total: stats.totalUsers,
// 								active: Math.floor(stats.totalUsers * 0.5),
// 								completed: Math.floor(stats.totalUsers * 0.3),
// 								overdue: Math.floor(stats.totalUsers * 0.2),
// 							}}
// 						/>
// 					</Paper>
// 				</Grid>

// 				<Grid item xs={12} md={5}>
// 					<Paper sx={{ p: 2, height: 380 }}>
// 						<Typography variant="h6" gutterBottom>
// 							Recent Activity
// 						</Typography>
// 						<List>
// 							<ListItem>
// 								<ListItemText primary="Developer 'John' completed task 42." />
// 							</ListItem>
// 							<Divider />
// 							<ListItem>
// 								<ListItemText primary="Manager 'Lisa' created project 'Xyz'." />
// 							</ListItem>
// 							<Divider />
// 							<ListItem>
// 								<ListItemText primary="Client 'Acme Inc' signed up." />
// 							</ListItem>
// 						</List>
// 					</Paper>
// 				</Grid>
// 			</Grid>
// 		</Box>
// 	);
// };

// export default AdminDashboardPage;



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
} from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";
import adminDashboardService from "../services/adminDashboardService";

const AdminDashboardPage = () => {
	const [stats, setStats] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await adminDashboardService.getAdminDashboardStats();
				setStats(response.data);
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

	// Safe access to role distribution
	const roleData = stats.userRoleDistribution || {};
	const developerCount = roleData.DEVELOPER || 0;
	const managerCount = roleData.MANAGER || 0;
	const clientCount = roleData.CLIENT || 0;
	const adminCount = roleData.ADMIN || 0;

	const recentActivity = [
		{ id: 1, text: "Manager 'Jane Doe' created a new project." },
		{ id: 2, text: "Client 'Big Corp' signed up." },
		{ id: 3, text: "Developer 'John Smith' completed a task." },
	];

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Admin Dashboard
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Users"
						value={stats.totalUsers}
						icon={<PeopleIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Projects"
						value={stats.totalProjects}
						icon={<AccountTreeIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Tasks Completed"
						value={stats.taskCompleted}
						icon={<AssignmentTurnedInIcon color="success" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Skills Defined"
						value={stats.skillsDefined}
						icon={<BuildIcon color="primary" />}
					/>
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


				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6">User Role Distribution</Typography>
						<ProjectStatusChart
							data={{
								developers: stats.userRoleDistribution.DEVELOPER || 0,
								managers: stats.userRoleDistribution.MANAGER || 0,
								clients: stats.userRoleDistribution.CLIENT || 0,
								admins: stats.userRoleDistribution.ADMIN || 0,
							}}
						/>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AdminDashboardPage;
