import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const getStatusColor = (status) => {
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

const getProjectStatusColor = (status) => {
  switch (status) {
    case "Ongoing":
      return "primary";
    case "Pending":
      return "warning";
    case "Delayed":
      return "error";
    case "OnHold":
      return "info";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const ManagerProjectDetails = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const managerId = storedUser?.user?.id;
  const token = storedUser?.token;

  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [availableDevelopers, setAvailableDevelopers] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const showError = (msg) => {
    setErrorMessage(msg);
    setOpenError(true);
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setOpenSuccess(true);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(
          `http://localhost:80/manager/${managerId}/project/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const fetchAvailableDevelopers = async () => {
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/available-developers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setAvailableDevelopers(data);
    } catch (error) {
      console.error("Failed to fetch available developers:", error);
    }
  };

  const handleAddMember = async () => {
    await fetchAvailableDevelopers();
    setOpenDialog(true);
  };

  const handleAddDeveloper = async (developerId) => {
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/project/${projectId}/add-developer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ developerId }),
        }
      );
      if (res.ok) {
        const addedDev = availableDevelopers.find(
          (dev) => dev.id === developerId
        );
        setProject((prev) => ({
          ...prev,
          members: [...prev.members, addedDev],
        }));
        setAvailableDevelopers((prev) =>
          prev.filter((dev) => dev.id !== developerId)
        );
        showSuccess(`${addedDev.name} added successfully.`);
      } else {
        const errData = await res.json();
        showError(errData.message || "Failed to add developer.");
      }
    } catch (error) {
      showError("Failed to add developer.");
    }
  };
  const handleEditClick = () => {
    setEditData({
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
    });
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/project/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        showError(err.message || "Failed to update project.");
        return;
      }

      await fetchProject(); // reload updated data from server
      setOpenEditDialog(false);
      showSuccess("Project updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      showError("Failed to update project.");
    }
  };

  const handleRemoveDeveloper = async (developerId) => {
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/project/${projectId}/remove-developer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ developerId }),
        }
      );
      if (res.ok) {
        const removedDev = project.members.find((m) => m.id === developerId);
        setProject((prev) => ({
          ...prev,
          members: prev.members.filter((member) => member.id !== developerId),
        }));
        showSuccess(`${removedDev?.name || "Developer"} removed successfully.`);
      } else {
        const errData = await res.json();
        showError(errData.message || "Failed to remove developer.");
      }
    } catch (error) {
      showError("Failed to remove developer.");
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!project)
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Project not found</Typography>
      </Box>
    );

  return (
    <Box p={3}>
      {/* ========== Project Details ========== */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            {project.title}
          </Typography>
          <Button variant="outlined" onClick={handleEditClick}>
            Edit Project
          </Button>
        </Stack>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          {project.description}
        </Typography>
        <Box my={2}>
          <Chip
            label={project.status}
            color={getProjectStatusColor(project.status)}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary" display="inline">
            Start Date: {project.startDate}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            display="inline"
            ml={2}
          >
            End Date: {project.endDate}
          </Typography>
        </Box>
      </Paper>

      {/* ========== Client Info ========== */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Client Information
        </Typography>
        {project.client ? (
          <Box>
            <Typography variant="body2">
              <strong>Name:</strong> {project.client.name}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {project.client.email}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No client information available
          </Typography>
        )}
      </Paper>

      {/* ========== Task Stats Section ========== */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Task Statistics
        </Typography>
        <Typography variant="body2">
          Open Tasks: <strong>{project.openTasks}</strong>
        </Typography>
        <Typography variant="body2">
          Total Tasks: <strong>{project.totalTasks}</strong>
        </Typography>
      </Paper>

      {/* ========== Project Members Section ========== */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Project Members</Typography>
          <Button variant="contained" onClick={handleAddMember}>
            Add Member
          </Button>
        </Stack>
        {project.members && project.members.length > 0 ? (
          <Grid container spacing={2}>
            {project.members.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    border: "1px solid #e0e0e0",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={
                        member.avatarUrl ||
                        `https://i.pravatar.cc/150?img=${Math.floor(
                          Math.random() * 70 + 1
                        )}`
                      }
                      alt={member.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2">{member.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {member.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Email: {member.email}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveDeveloper(member.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No members assigned to this project.
          </Typography>
        )}
      </Paper>

      {/* ========== Tasks Section ========== */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        {project.tasks && project.tasks.length > 0 ? (
          project.tasks.map((task) => (
            <Paper
              key={task.id}
              variant="outlined"
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
              </Box>
              <Chip
                label={task.status}
                color={getStatusColor(task.status)}
                size="small"
              />
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">No tasks found.</Typography>
        )}
      </Paper>

      {/* ========== Add Member Dialog ========== */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Developer to Add</DialogTitle>
        <DialogContent>
          <List>
            {availableDevelopers.map((dev) => (
              <ListItem key={dev.id} divider>
                <ListItemAvatar>
                  <Avatar
                    src={`https://i.pravatar.cc/150?img=${Math.floor(
                      Math.random() * 70 + 1
                    )}`}
                  />
                </ListItemAvatar>
                <ListItemText primary={dev.name} secondary={dev.email} />
                <Button
                  variant="outlined"
                  onClick={() => handleAddDeveloper(dev.id)}
                >
                  Add
                </Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Project Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editData.title}
              onChange={handleEditChange}
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editData.description}
              onChange={handleEditChange}
              rows={3}
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="date"
              name="startDate"
              value={editData.startDate}
              onChange={handleEditChange}
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="date"
              name="endDate"
              value={editData.endDate}
              onChange={handleEditChange}
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <select
              name="status"
              value={editData.status}
              onChange={handleEditChange}
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            >
              <option value="ONGOING">ONGOING</option>
              <option value="PENDING">PENDING</option>
              <option value="DELAYED">DELAYED</option>
              <option value="ONHOLD">ONHOLD</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== Snackbars ========== */}
      <Snackbar
        open={openError}
        autoHideDuration={4000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          onClose={() => setOpenError(false)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSuccess}
        autoHideDuration={4000}
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setOpenSuccess(false)}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerProjectDetails;
