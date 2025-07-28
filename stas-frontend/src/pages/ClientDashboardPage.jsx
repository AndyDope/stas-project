import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
import FolderIcon from "@mui/icons-material/Folder";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import dsahboardService from "../services/dashboadService";
import dashboadService from "../services/dashboadService";

const ClientDashboardPage = () => {
	const [stats, setStats] = useState({
		total: 5,
		active: 2,
		completed: 2,
		overdue: 1,
	});
	const [recentProjects, setRecentProjects] = useState([]);
	const [loading, setLoading] = useState(true); // Start in a loading state
	const [error, setError] = useState(null);

	// 2. Use useEffect to fetch data when the component mounts
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				// The await keyword "waits" for the promise to resolve
				const response = await dashboadService.getClientDashboardStats();

				// The actual data is in response.data
				setStats(response.data);
				setRecentProjects(response.data.recentProjects);
			} catch (err) {
				setError("Failed to load dashboard data. Please try again later.");
				console.error("Error fetching dashboard data:", err);
			} finally {
				// This runs whether the request succeeded or failed
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []); // The empty array [] means this effect runs only once, like componentDidMount

	// 3. Conditional rendering based on the state
	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "60vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	// const stats = { total: 12, active: 5, completed: 6, overdue: 1 };
	// const data = dsahboardService.clientStats();
	// const stats = { data };
	// console.log(data);
	// console.log(stats);

	// const recentProjects = [
	// 	/* ... mock data ... */
	// ];

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Client Dashboard
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Projects"
						value={stats.total}
						icon={<FolderIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Active Projects"
						value={stats.active}
						icon={<SyncIcon color="warning" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Completed"
						value={stats.completed}
						icon={<CheckCircleIcon color="success" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Overdue"
						value={stats.overdue}
						icon={<ErrorIcon color="error" />}
					/>
				</Grid>
				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6">Projects Overview</Typography>
						<ProjectStatusChart data={stats} />
					</Paper>
				</Grid>
				<Grid item xs={12} md={5}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6">Recent Projects</Typography>
						{/* List component here */}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ClientDashboardPage;
