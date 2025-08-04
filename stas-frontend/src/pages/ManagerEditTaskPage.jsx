import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const taskStatuses = ["ACTIVE", "COMPLETED", "OVERDUE", "PENDING"];

const ManagerEditTaskPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = storedUser?.user?.id;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTaskId = queryParams.get("taskId");
  const initialProjectId = queryParams.get("projectId");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || ""
  );
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId || "");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    developerId: "",
    status: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(true);

  // Load all projects on page load
  useEffect(() => {
    fetch(`http://localhost:80/manager/${managerId}/myProjects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  // Load team members and tasks when a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      setLoading(true);
      Promise.all([
        fetch(
          `http://localhost:80/manager/${managerId}/project/${selectedProjectId}/teamMembers`
        ).then((res) => res.json()),
        fetch(
          `http://localhost:80/manager/${managerId}/project/${selectedProjectId}/tasks`
        ).then((res) => res.json()),
      ])
        .then(([devs, tasks]) => {
          setDevelopers(devs);
          setTasks(tasks);
        })
        .catch((err) => console.error("Failed to load project data", err))
        .finally(() => setLoading(false));
    } else {
      setDevelopers([]);
      setTasks([]);
      setSelectedTaskId("");
      setLoading(false);
    }
  }, [selectedProjectId]);

  // Load task form data when tasks are loaded AND selectedTaskId exists
  useEffect(() => {
    if (!selectedTaskId || tasks.length === 0) return;

    const task = tasks.find((t) => t.id === parseInt(selectedTaskId));
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate?.split("T")[0] || "",
        developerId: task.assignedTo?.id || "",
        status: task.status || "",
      });
    }
  }, [selectedTaskId, tasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetAll = () => {
    setSelectedProjectId("");
    setSelectedTaskId("");
    setForm({
      title: "",
      description: "",
      dueDate: "",
      developerId: "",
      status: "",
    });
    setDevelopers([]);
    setTasks([]);
  };

  const handleUpdate = () => {
    const payload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      assignedTo: form.developerId,
      projectId: selectedProjectId,
      status: form.status,
    };

    fetch(`http://localhost:80/manager/${managerId}/task/${selectedTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        setSnackbar({
          open: true,
          message: "Task updated successfully!",
          severity: "success",
        });
        resetAll();
      })
      .catch((err) =>
        setSnackbar({
          open: true,
          message: err.message || "Error occurred",
          severity: "error",
        })
      );
  };

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Task
        </Typography>

        <TextField
          label="Select Project"
          select
          fullWidth
          margin="normal"
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setSelectedTaskId("");
            setForm({
              title: "",
              description: "",
              dueDate: "",
              developerId: "",
              status: "",
            });
          }}
        >
          {projects.map((proj) => (
            <MenuItem key={proj.id} value={proj.id}>
              {proj.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Select Task"
          select
          fullWidth
          margin="normal"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          disabled={!selectedProjectId}
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
                name="title"
                fullWidth
                margin="normal"
                value={form.title}
                onChange={handleChange}
              />

              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
              />

              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={form.dueDate}
                onChange={handleChange}
              />

              <TextField
                label="Assign to Developer"
                name="developerId"
                select
                fullWidth
                margin="normal"
                value={form.developerId}
                onChange={handleChange}
              >
                {developers.map((dev) => (
                  <MenuItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Status"
                name="status"
                select
                fullWidth
                margin="normal"
                value={form.status}
                onChange={handleChange}
              >
                {taskStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleUpdate}
                disabled={
                  !form.title ||
                  !form.description ||
                  !form.dueDate ||
                  !form.developerId ||
                  !form.status
                }
              >
                Update Task
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

export default ManagerEditTaskPage;
