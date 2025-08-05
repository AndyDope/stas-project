import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const CreateProjectPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const client = storedUser?.user.id;
  const token = storedUser?.token;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [managerId, setManagerId] = useState("");
  const [managers, setManagers] = useState([]);

  // 🔄 Fetch all managers from backend
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch(
          "http://localhost:80/api/client/getAllManagers",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setManagers(data);
        console.log("Fetched managers:", data); // Debugging line to check fetched managers
      } catch (error) {
        console.error("Failed to fetch managers:", error);
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const projectData = {
      clientId: client, // Assuming client is the ID of the client making the request
      title: title,
      description: description,
      completionDate: completionDate,
      managerId: managerId,
    };

    try {
      console.log(client);
      console.log("Submitting project data:", projectData); // Debugging line to check project data
      const res = await fetch(
        "http://localhost:80/api/client/project/addProject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        }
      );

      if (res.ok) {
        alert("Project created successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setCompletionDate("");
        setManagerId("");
      } else {
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Submit a New Project Request
      </Typography>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h6" gutterBottom>
          Project Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill out the form below with as much detail as possible. Our team will
          review your request and assign a Project Manager to get started.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            fullWidth
            label="Project Title"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            required
            fullWidth
            multiline
            rows={6}
            label="Project Description"
            margin="normal"
            placeholder="Describe your project goals, key features, target audience, and any other important details."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            type="date"
            label="Ideal Completion Date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="manager-select-label">Select Manager</InputLabel>
            <Select
              labelId="manager-select-label"
              value={managerId}
              label="Select Manager"
              onChange={(e) => setManagerId(e.target.value)}
            >
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name} ({manager.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
            Submit Project Request
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProjectPage;
