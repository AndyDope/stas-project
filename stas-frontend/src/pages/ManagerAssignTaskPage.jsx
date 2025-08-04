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
  ListSubheader,
} from "@mui/material";

const ManagerAssignTaskPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const managerId = storedUser?.user?.id;
  const token = storedUser?.token;

  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [highlyRecommendedDevs, setHighlyRecommendedDevs] = useState([]);
  const [recommendedDevs, setRecommendedDevs] = useState([]);
  const [otherDevs, setOtherDevs] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    developerId: "",
    requiredSkills: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:80/manager/${managerId}/myProjects`
        );
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err.message);
        setSnackbar({
          open: true,
          message: "Error loading projects",
          severity: "error",
        });
      }
    };

    loadProjects();
  }, [managerId]);

  useEffect(() => {
    const loadDevelopers = async () => {
      if (!selectedProjectId) {
        setDevelopers([]);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:80/manager/${managerId}/project/${selectedProjectId}/teamMembers`
        );
        if (!res.ok) throw new Error("Failed to load developers");
        const data = await res.json();
        console.log("Loaded developers:", data);
        setDevelopers(data);
      } catch (err) {
        console.error(err.message);
        setSnackbar({
          open: true,
          message: "Error loading developers",
          severity: "error",
        });
      }
    };

    loadDevelopers();
  }, [selectedProjectId]);

  useEffect(() => {
    const skillsInput = form.requiredSkills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (skillsInput.length > 0 && developers.length > 0) {
      const scored = developers.map((dev) => {
        const devSkills = dev.skills?.map((s) => s.toLowerCase()) || [];
        const matches = skillsInput.filter((skill) =>
          devSkills.includes(skill)
        );
        return { ...dev, matchCount: matches.length };
      });

      const highly = scored.filter((d) => d.matchCount === skillsInput.length);
      const recommended = scored.filter(
        (d) => d.matchCount > 0 && d.matchCount < skillsInput.length
      );
      const others = scored.filter((d) => d.matchCount === 0);

      setHighlyRecommendedDevs(highly);
      setRecommendedDevs(recommended);
      setOtherDevs(others);
    } else {
      setHighlyRecommendedDevs(developers);
      setRecommendedDevs([]);
      setOtherDevs([]);
    }
  }, [form.requiredSkills, developers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async () => {
    const taskPayload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      assignedTo: form.developerId,
      assignedBy: managerId,
      projectId: selectedProjectId,
    };
    try {
      const res = await fetch(
        `http://localhost:80/manager/${managerId}/createtask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskPayload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to assign task");
      }

      setSnackbar({
        open: true,
        message: "Task submitted successfully!",
        severity: "success",
      });
      setForm({
        title: "",
        description: "",
        dueDate: "",
        developerId: "",
        requiredSkills: "",
      });
      setSelectedProjectId("");
    } catch (err) {
      console.error(err.message);
      setSnackbar({
        open: true,
        message: `Error: ${err.message}`,
        severity: "error",
      });
    }
  };

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Assign Task
        </Typography>

        <TextField
          label="Select Project"
          select
          fullWidth
          margin="normal"
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setForm((prev) => ({ ...prev, developerId: "" }));
          }}
        >
          {projects.map((proj) => (
            <MenuItem key={proj.id} value={proj.id}>
              {proj.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Required Skills (comma-separated)"
          name="requiredSkills"
          fullWidth
          margin="normal"
          value={form.requiredSkills}
          onChange={handleChange}
          placeholder="e.g., Java, React, SQL"
        />

        <TextField
          label="Select Developer"
          select
          fullWidth
          margin="normal"
          name="developerId"
          value={form.developerId}
          onChange={handleChange}
          disabled={!selectedProjectId}
        >
          {highlyRecommendedDevs.length > 0 && (
            <ListSubheader>Highly Recommended</ListSubheader>
          )}
          {highlyRecommendedDevs.map((dev) => (
            <MenuItem key={dev.id} value={dev.id}>
              {dev.name}
            </MenuItem>
          ))}
          {recommendedDevs.length > 0 && (
            <ListSubheader>Recommended</ListSubheader>
          )}
          {recommendedDevs.map((dev) => (
            <MenuItem key={dev.id} value={dev.id}>
              {dev.name}
            </MenuItem>
          ))}
          {otherDevs.length > 0 && (
            <ListSubheader>Other Developers</ListSubheader>
          )}
          {otherDevs.map((dev) => (
            <MenuItem key={dev.id} value={dev.id}>
              {dev.name}
            </MenuItem>
          ))}
        </TextField>

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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleAssign}
          disabled={
            !form.title ||
            !form.description ||
            !form.dueDate ||
            !form.developerId ||
            !selectedProjectId
          }
        >
          Assign Task
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerAssignTaskPage;
