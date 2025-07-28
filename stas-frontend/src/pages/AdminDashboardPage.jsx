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
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart"; // We can reuse this chart
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";

const AdminDashboardPage = () => {
	// Mock data - replace with API calls
	const stats = { total: 4, active: 2, completed: 1, overdue: 1 }; // Example for role distribution
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
						value="86"
						icon={<PeopleIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Projects"
						value="12"
						icon={<AccountTreeIcon color="primary" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Tasks Completed"
						value="157"
						icon={<AssignmentTurnedInIcon color="success" />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Skills Defined"
						value="35"
						icon={<BuildIcon color="primary" />}
					/>
				</Grid>

				<Grid item xs={12} md={7}>
					<Paper sx={{ p: 2, height: 380 }}>
						<Typography variant="h6">User Role Distribution</Typography>
						{/* Reusing the chart component with different data */}
						<ProjectStatusChart
							data={{ total: 86, active: 40, completed: 30, overdue: 16 }}
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={5}>
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
				</Grid>
			</Grid>
		</Box>
	);
};

export default AdminDashboardPage;
