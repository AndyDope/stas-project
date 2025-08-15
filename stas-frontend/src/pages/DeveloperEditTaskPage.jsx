import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";

const taskStatuses = ["ACTIVE", "OVERDUE", "PENDING", "INREVIEW"];

const DeveloperEditTaskPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const developerId = storedUser?.user?.id;
  const token = storedUser?.token;

  const { taskId } = useParams(); // from URL
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetch(`http://localhost:80/developer/${developerId}/myAllTasks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        // If taskId is present in URL, select it
        if (taskId) {
          const foundTask = data.find((t) => t.id === parseInt(taskId));
          if (foundTask) {
            setSelectedTaskId(taskId);
            setForm({
              title: foundTask.title || "",
              description: foundTask.description || "",
              dueDate: foundTask.dueDate?.split("T")[0] || "",
              status: foundTask.status || "",
            });
          }
        }
      })
      .catch((err) => console.error("Failed to load tasks", err))
      .finally(() => setLoading(false));
  }, [developerId, taskId, token]);

  useEffect(() => {
    if (!selectedTaskId || tasks.length === 0) return;
    const task = tasks.find((t) => t.id === parseInt(selectedTaskId));
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate?.split("T")[0] || "",
        status: task.status || "",
      });
    }
  }, [selectedTaskId, tasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const payload = { status: form.status };

    fetch(
      `http://localhost:80/developer/${developerId}/task/${selectedTaskId}/updateTask`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");

        setForm({
          title: "",
          description: "",
          dueDate: "",
          status: "",
        });
        setSelectedTaskId("");

        setSnackbar({
          open: true,
          message: "Status updated successfully!",
          severity: "success",
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: err.message || "Error occurred",
          severity: "error",
        });
      });
  };

  const isCompleted = form.status === "COMPLETED";

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit My Task Status
        </Typography>

        <TextField
          label="Select Task"
          select
          fullWidth
          margin="normal"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
        >
          {tasks.map((task) => (
            <MenuItem key={task.id} value={task.id}>
              {task.title}
            </MenuItem>
          ))}
        </TextField>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          selectedTaskId && (
            <>
              <TextField
                label="Task Title"
                value={form.title}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Description"
                value={form.description}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Due Date"
                value={form.dueDate}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Status"
                name="status"
                select={!isCompleted}
                fullWidth
                margin="normal"
                value={form.status}
                onChange={handleChange}
                InputProps={{
                  readOnly: isCompleted,
                }}
              >
                {isCompleted ? (
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                ) : (
                  taskStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))
                )}
              </TextField>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: isCompleted ? "red" : "primary.main",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: isCompleted ? "darkred" : "primary.dark",
                  },
                }}
                onClick={handleUpdate}
                disabled={isCompleted}
              >
                {isCompleted ? "Task is Completed" : "Update Status"}
              </Button>
            </>
          )
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeveloperEditTaskPage;
