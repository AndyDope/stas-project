import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const getProjectStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "primary";
    case "COMPLETED":
      return "success";
    case "OVERDUE":
      return "error";
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

const statusOrder = ["ACTIVE", "COMPLETED", "OVERDUE", "PENDING", "INREVIEW"];

const groupAndSortTasks = (tasks) => {
  const groups = {};

  statusOrder.forEach((status) => {
    groups[status] = [];
  });

  tasks.forEach((task) => {
    const status = task.status?.toUpperCase();
    if (groups[status]) {
      groups[status].push(task);
    }
  });

  statusOrder.forEach((status) => {
    groups[status].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  });

  return groups;
};

const ManagerAllTasksPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const managerId = storedUser?.user?.id;
  const token = storedUser?.token;

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/tasks`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  const groupedTasks = groupAndSortTasks(tasks);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        All Tasks
      </Typography>

      {tasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        statusOrder.map(
          (status) =>
            groupedTasks[status]?.length > 0 && (
              <Box key={status} mt={4}>
                <Typography variant="h6" gutterBottom>
                  {status.charAt(0) + status.slice(1).toLowerCase()} Tasks
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {groupedTasks[status].map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                        <Box
                          mt={1}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Chip
                            label={task.status}
                            color={getProjectStatusColor(task.status)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" mt={1}>
                          <strong>Project:</strong> {task.project?.title}
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/manager/edit-task?taskId=${task.id}&projectId=${task.project.id}`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
        )
      )}
    </Box>
  );
};

export default ManagerAllTasksPage;
