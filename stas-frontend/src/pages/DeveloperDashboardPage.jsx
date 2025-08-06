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
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StatCard from "../components/dashboard/StatCard";
import ProjectStatusChart from "../components/dashboard/ProjectStatusChart";

import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#fafafa",
  minHeight: "100vh",
  padding: theme.spacing(3),
}));

const SimpleCard = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e0e0e0",
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const StatCardSimple = styled(SimpleCard)(() => ({
  height: "120px",
  display: "flex",
  alignItems: "center",
}));

const ChartCard = styled(SimpleCard)(({ theme }) => ({
  height: "480px",
  padding: theme.spacing(2),
}));

const TaskCard = styled(SimpleCard)(({ theme }) => ({
  height: "480px",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));

const TaskListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "4px",
  marginBottom: theme.spacing(1),
  backgroundColor: "#f9f9f9",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: "#333",
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

const DeveloperDashboardPage = () => {
  const [stats, setStats] = useState({
    myTasks: 0,
    overdue: 0,
    completed: 0,
    pending: 0,
  });
  const [oldestTasks, setOldestTasks] = useState([]);

  const fetchStatsAndTasks = async () => {
    const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
    const developerId = storedUser?.user?.id;
    const token = storedUser?.token;

    try {
      const statsRes = await fetch(
        `http://localhost:80/developer/${developerId}/dashboardStats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const statsData = await statsRes.json();
      setStats(statsData);

      const taskRes = await fetch(
        `http://localhost:80/developer/${developerId}/myTasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const taskData = await taskRes.json();
      setOldestTasks(taskData);
    } catch (error) {
      console.error("Error fetching developer dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchStatsAndTasks();
  }, []);

  const getStatusColor = (dueDate) => {
    if (!dueDate) return "default";
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "error";
    if (diffDays <= 2) return "warning";
    return "success";
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const statItems = [
    {
      title: "My Tasks",
      value: stats.myTasks,
      icon: <AssignmentIcon sx={{ color: "#1976d2", fontSize: 32 }} />,
    },
    {
      title: "Overdue Tasks",
      value: stats.overdue,
      icon: <ReportProblemIcon sx={{ color: "#d32f2f", fontSize: 32 }} />,
    },
    {
      title: "Completed Tasks",
      value: stats.completed,
      icon: <CheckCircleOutlineIcon sx={{ color: "#2e7d32", fontSize: 32 }} />,
    },
    {
      title: "Pending Tasks",
      value: stats.pending,
      icon: <PendingActionsIcon sx={{ color: "#ed6c02", fontSize: 32 }} />,
    },
  ];

  return (
		<DashboardContainer>
			<HeaderTitle variant="h4">Developer Dashboard</HeaderTitle>

			<Grid container spacing={3}>
				{statItems.map((item, index) => (
					<Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
						<StatCardSimple>
							<CardContent
								sx={{
									display: "flex",
									alignItems: "center",
									width: "100%",
									py: 2,
								}}
							>
								<Box sx={{ mr: 2 }}>{item.icon}</Box>
								<Box>
									<Typography
										variant="h5"
										sx={{ fontWeight: 600, color: "#333" }}
									>
										{item.value}
									</Typography>
									<Typography variant="body2" sx={{ color: "#666" }}>
										{item.title}
									</Typography>
								</Box>
							</CardContent>
						</StatCardSimple>
					</Grid>
				))}

				<Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<ChartCard>
						<Typography
							variant="h6"
							sx={{ mb: 2, color: "#333", fontWeight: 500 }}
						>
							Task Status Overview
						</Typography>
						<Box sx={{ height: "calc(100% - 40px)" }}>
							<ProjectStatusChart
								data={{
									total: stats.myTasks,
									active: stats.pending,
									completed: stats.completed,
									overdue: stats.overdue,
									pending: stats.pending,
								}}
							/>
						</Box>
					</ChartCard>
				</Grid>

				<Grid size={{ xs: 12, md: 6, lg: 5 }}>
					<TaskCard>
						<Typography
							variant="h6"
							sx={{ mb: 2, width: 300, color: "#333", fontWeight: 500 }}
						>
							My Tasks
						</Typography>
						<Box sx={{ flex: 1, overflow: "hidden" }}>
							<List
								sx={{
									height: "100%",
									overflow: "auto",
									padding: 0,
								}}
							>
								{oldestTasks.length > 0 ? (
									oldestTasks.map((task, index) => (
										<React.Fragment key={task.id}>
											<TaskListItem>
												<ListItemText
													primary={
														<Typography
															variant="body1"
															sx={{
																fontWeight: 500,
																color: "#333",
																mb: 0.5,
															}}
														>
															{task.title || "Untitled Task"}
														</Typography>
													}
													secondary={
														<Box
															sx={{
																display: "flex",
																gap: 1,
																alignItems: "center",
																flexWrap: "wrap",
															}}
														>
															<Chip
																label={`Due: ${formatDueDate(task.dueDate)}`}
																color={getStatusColor(task.dueDate)}
																size="small"
																variant="outlined"
															/>
														</Box>
													}
												/>
											</TaskListItem>
											{index < oldestTasks.length - 1 && (
												<Divider sx={{ my: 0.5 }} />
											)}
										</React.Fragment>
									))
								) : (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											height: "200px",
											color: "#666",
										}}
									>
										<Typography variant="body2">No tasks available</Typography>
									</Box>
								)}
							</List>
						</Box>
					</TaskCard>
				</Grid>
			</Grid>
		</DashboardContainer>
	);
};

export default DeveloperDashboardPage;
