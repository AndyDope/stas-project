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
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";
import FolderIcon from "@mui/icons-material/Folder";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const ClientDashboardPage = () => {
	const stats = { total: 12, active: 5, completed: 6, overdue: 1 };
	const recentProjects = [
		/* ... mock data ... */
	];

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
