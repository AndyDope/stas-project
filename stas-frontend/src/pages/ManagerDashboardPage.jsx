import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ManagerDashboardPage = () => {
  const stats = { activeProjects: 3, teamMembers: 8, openTasks: 25, overdueTasks: 2 };

  return (
		<Box sx={{ width: "100%", px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
			<Typography
				variant="h4"
				sx={{ mb: 3, fontSize: { xs: 24, sm: 28, md: 32 } }}
			>
				Manager Dashboard
			</Typography>
			{/* First row: 4 StatCards, responsive and equal width */}
			<Grid container spacing={3}>
				{[
					{
						title: "My Active Projects",
						value: stats.activeProjects,
						icon: (
							<AssessmentIcon
								color="primary"
								sx={{ fontSize: { xs: 32, md: 40 } }}
							/>
						),
					},
					{
						title: "My Team Members",
						value: stats.teamMembers,
						icon: (
							<PeopleIcon
								color="primary"
								sx={{ fontSize: { xs: 32, md: 40 } }}
							/>
						),
					},
					{
						title: "Open Tasks",
						value: stats.openTasks,
						icon: (
							<AssignmentIcon
								color="primary"
								sx={{ fontSize: { xs: 32, md: 40 } }}
							/>
						),
					},
					{
						title: "Overdue Tasks",
						value: stats.overdueTasks,
						icon: (
							<ReportProblemIcon
								color="error"
								sx={{ fontSize: { xs: 32, md: 40 } }}
							/>
						),
					},
				].map((stat, idx) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						key={stat.title}
						sx={{ display: "flex" }}
					>
						<Box sx={{ flex: 1, display: "flex" }}>
							<StatCard
								title={stat.title}
								value={stat.value}
								icon={stat.icon}
								sx={{ flex: 1, width: "100%" }}
							/>
						</Box>
					</Grid>
				))}
			</Grid>
			{/* Second row: 2 charts, responsive */}
			<Grid container spacing={3} sx={{ mt: 1 }}>
				<Grid item xs={12} md={6} sx={{ display: "flex" }}>
					<Paper
						sx={{
							p: { xs: 1, sm: 2 },
							height: { xs: 200, sm: 280, md: 320 },
							width: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
						}}
					>
						<Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
							Team Workload Bar Chart
						</Typography>
					</Paper>
				</Grid>
				<Grid item xs={12} md={6} sx={{ display: "flex" }}>
					<Paper
						sx={{
							p: { xs: 1, sm: 2 },
							height: { xs: 200, sm: 280, md: 320 },
							width: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
						}}
					>
						<Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
							Project Status Donut Chart
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ManagerDashboardPage;