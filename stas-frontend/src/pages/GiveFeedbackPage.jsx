import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import clientService from "../services/clientService"; // To get projects
import feedbackService from "../services/feedbackService"; // To handle feedback

const GiveFeedbackPage = () => {
  const location = useLocation();
  const preselectedProjectId = location.state?.selectedProjectId || "";
  const [projects, setProjects] = useState([]);
  const [pastFeedback, setPastFeedback] = useState([]);
  const [formData, setFormData] = useState({
    projectId: preselectedProjectId,
    rating: 0,
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  console.log("Preselected Project ID:", preselectedProjectId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, feedbackResponse] = await Promise.all([
          clientService.getProjects(0, 100), // Fetch client's projects for the dropdown
          feedbackService.getMyFeedbackHistory(),
        ]);
        setProjects(
          projectsResponse.data.content.filter(
            (project) => project.status === "COMPLETED"
          )
        );
        setPastFeedback(feedbackResponse.data);
      } catch (err) {
        setError("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await feedbackService.submitFeedback(formData);
      const feedbackResponse = await feedbackService.getMyFeedbackHistory();
      setPastFeedback(feedbackResponse.data);
      setSuccess("Thank you! Your feedback has been submitted.");
      setFormData({ projectId: "", rating: 0, content: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Give Project Feedback
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Submit Feedback for a Project
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select a Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  label="Select a Project"
                  onChange={handleChange}
                >
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography component="legend" sx={{ mt: 2 }}>
                Overall Rating
              </Typography>
              <Rating
                name="rating"
                value={Number(formData.rating)}
                onChange={(e, newVal) =>
                  setFormData({ ...formData, rating: newVal })
                }
                size="large"
              />
              <TextField
                fullWidth
                multiline
                rows={5}
                margin="normal"
                label="Feedback Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ p: 2, fontWeight: 600 }}
            >
              My Feedback History
            </Typography>
            <List sx={{ maxHeight: 500, overflow: "auto" }}>
              {pastFeedback.length > 0 ? (
                pastFeedback.map((fb, index) => (
                  <React.Fragment key={fb.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              component="span"
                              sx={{ fontWeight: "bold" }}
                            >
                              {fb.subject}
                            </Typography>{" "}
                            <Rating
                              readOnly
                              value={fb.rating}
                              size="small"
                              sx={{ verticalAlign: "middle", ml: 1 }}
                            />
                          </>
                        }
                        secondary={fb.content}
                      />
                    </ListItem>
                    {index < pastFeedback.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography sx={{ p: 2 }}>
                  You have not submitted any feedback yet.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default GiveFeedbackPage;
