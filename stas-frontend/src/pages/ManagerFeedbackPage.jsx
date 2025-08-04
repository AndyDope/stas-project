import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Rating,
  Paper,
} from "@mui/material";

const ManagerFeedbackPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const managerId = storedUser?.user?.id;
  const token = storedUser?.token;
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  // Load all projects for manager
  useEffect(() => {
    fetch(`http://localhost:80/manager/${managerId}/myProjects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects", err));
  }, [managerId]);

  // Load developers of selected project
  useEffect(() => {
    if (!selectedProjectId) return;
    fetch(
      `http://localhost:80/manager/${managerId}/project/${selectedProjectId}/teamMembers`
    )
      .then((res) => res.json())
      .then((data) => setDevelopers(data))
      .catch((err) => console.error("Error loading developers", err));
  }, [selectedProjectId]);

  // Load tasks for selected project and developer
  useEffect(() => {
    if (!selectedDeveloper || !selectedProjectId) return;
    fetch(
      `http://localhost:80/manager/${managerId}/project/${selectedProjectId}/teamMembers/${selectedDeveloper}/tasks`
      ///{managerId}/project/{projectId}/teamMembers/{developerId}/tasks
    )
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error loading tasks", err));
  }, [selectedDeveloper, selectedProjectId]);

  // Load feedback history for manager
  useEffect(() => {
    fetch(`http://localhost:80/manager/${managerId}/feedbacks`)
      .then((res) => res.json())
      .then((data) => setFeedbackHistory(data))
      .catch((err) => console.error("Error loading feedback history", err));
  }, [managerId]);

  const handleSubmit = async () => {
    if (
      !selectedProjectId ||
      !selectedDeveloper ||
      !selectedTaskId ||
      !feedbackContent ||
      rating === 0
    )
      return;

    const payload = {
      developerId: selectedDeveloper,
      taskId: selectedTaskId,
      rating: rating,
      content: feedbackContent,
      projectId: selectedProjectId,
    };

    await fetch(`http://localhost:80/manager/${managerId}/giveFeedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Reset fields
    setSelectedDeveloper("");
    setSelectedTaskId("");
    setRating(0);
    setFeedbackContent("");
    setTasks([]);

    // Reload feedback history
    const updatedHistory = await fetch(
      `http://localhost:80/manager/${managerId}/feedbacks`
    ).then((res) => res.json());
    setFeedbackHistory(updatedHistory);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Give Feedback to Developers
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 5 }}>
        {/* Select Project */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select a Project</InputLabel>
          <Select
            value={selectedProjectId}
            label="Select a Project"
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setSelectedDeveloper("");
              setSelectedTaskId("");
              setDevelopers([]);
              setTasks([]);
            }}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Developer */}
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedProjectId}>
          <InputLabel>Select a Developer</InputLabel>
          <Select
            value={selectedDeveloper}
            label="Select a Developer"
            onChange={(e) => {
              setSelectedDeveloper(e.target.value);
              setSelectedTaskId("");
              setTasks([]);
            }}
          >
            {developers.map((dev) => (
              <MenuItem key={dev.id} value={dev.id}>
                {dev.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Task */}
        <FormControl
          fullWidth
          sx={{ mb: 2 }}
          disabled={!selectedDeveloper || tasks.length === 0}
        >
          <InputLabel>Select a Task</InputLabel>
          <Select
            value={selectedTaskId}
            label="Select a Task"
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            {tasks.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Rating and Feedback */}
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="developer-rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
        </Box>

        <TextField
          label="Feedback Content"
          multiline
          rows={4}
          fullWidth
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !selectedDeveloper || !selectedTaskId || !rating || !feedbackContent
          }
        >
          Submit Feedback
        </Button>
      </Paper>

      {/* Feedback History */}
      <Typography variant="h5" gutterBottom>
        My Given Feedback History
      </Typography>

      {feedbackHistory.map((fb, index) => (
        <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            Project: {fb.projectTitle} | Developer: {fb.developerName} | Task:{" "}
            {fb.taskTitle}
          </Typography>
          <Rating value={fb.rating} readOnly size="small" />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {fb.feedback}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ManagerFeedbackPage;
