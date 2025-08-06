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
				setRecentProjects(response.data.recentProjects.reverse());
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

			<Grid container spacing={3}>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Pending"
						value={stats.pending}
						icon={<PendingActionsIcon color="warning" />}
					/>
				</Grid>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Active"
						value={stats.active}
						icon={<SyncIcon color="primary" />}
					/>
				</Grid>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Completed"
						value={stats.completed}
						icon={<CheckCircleIcon color="success" />}
					/>
				</Grid>
				<Grid size={{ xs: 6, sm: 6, md: 3 }}>
					<StatCard
						title="Overdue"
						value={stats.overdue}
						icon={<ErrorIcon color="error" />}
					/>
				</Grid>
			</Grid>

			<Grid container spacing={3} sx={{ mt: 3 }}>
				<Grid size={{ xs: 12, md: 5 }}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6" gutterBottom>
							Projects Overview
						</Typography>
						<Box sx={{ height: "calc(100% - 30px)" }}>
							<ProjectStatusChart data={stats} label={"# project"} />
						</Box>
					</Paper>
				</Grid>

				<Grid size={{ xs: 12, md: 7 }}>
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

export default ClientDashboardPage;
