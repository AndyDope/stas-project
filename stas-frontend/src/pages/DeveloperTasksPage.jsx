import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import KanbanBoard from "../components/projects/KanbanBoard";

// Removed unused import
// import { useParams } from "react-router-dom";

const DeveloperTasksPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const developerId = storedUser?.user?.id;
  const token = storedUser?.token;

  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:80/developer/${developerId}/myAllTasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setMyTasks(data);
        console.log("Fetched tasks:", data); // You can remove this after debugging
      } catch (err) {
        console.error("Error fetching developer tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [developerId, token]);

  // Convert backend statuses to display-friendly labels
  const formatStatus = (status) => {
    switch (status) {
      case "OVERDUE":
        return "🔥 Overdue";
      case "PENDING":
        return "⏳ Pending";
      case "ACTIVE":
        return "🛠️ Active";
      case "INREVIEW":
        return "🔍 In Review";
      case "COMPLETED":
        return "✅ Completed";
      default:
        return status;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          My Tasks
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Tasks assigned to you across all projects.
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <KanbanBoard initialTasks={myTasks} formatStatus={formatStatus} />
        )}
      </Paper>
    </Box>
  );
};

export default DeveloperTasksPage;
