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
	Alert,
	Chip,
} from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
import clientService from "../services/clientService";

import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const getStatusChipColor = (status) => {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "ONGOING":
			return "primary";
		case "PENDING":
			return "warning";
		default:
			return "default";
	}
};

const ClientDashboardPage = () => {
	const [stats, setStats] = useState(null);
	const [recentProjects, setRecentProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const response = await clientService.getClientDashboardStats();
				setStats(response.data.stats);
				setRecentProjects(response.data.recentProjects);
			} catch (err) {
				setError("Failed to load dashboard data. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardData();
	}, []);

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

	if (!stats) {
		return <Alert severity="info">No dashboard data available.</Alert>;
	}

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Client Dashboard
			</Typography>

			{/* *** FIX: Separate Grid container for the top row of stat cards *** */}
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Pending"
						value={stats.pending}
						icon={<PendingActionsIcon color="warning" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Active"
						value={stats.active}
						icon={<SyncIcon color="primary" />}
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
			</Grid>

			{/* *** FIX: A second, independent Grid container for the bottom row *** */}
			<Grid container spacing={3} sx={{ mt: 1 }}>
				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6" gutterBottom>
							Projects Overview
						</Typography>
						<Box sx={{ height: "calc(100% - 30px)" }}>
							<ProjectStatusChart data={stats} />
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12} md={5}>
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
											<Chip
												label={project.status}
												color={getStatusChipColor(project.status)}
												size="small"
											/>
										}
									>
										<ListItemText
											primary={project.title}
											sx={{
												// *** THIS IS THE FIX ***
												// We add a right margin to the text container itself.
												// This creates space for the secondaryAction (the Chip) to render
												// without overlapping the text.
												marginRight: "120px", // Adjust this value if your badges are wider

												// These styles now work correctly because the container has a defined boundary.
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

export default ClientDashboardPage;
