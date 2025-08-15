import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Rating,
  Stack,
} from "@mui/material";

const DeveloperFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser?.user?.id;
        const token = storedUser?.token;

        if (!userId || !token) throw new Error("User not logged in");

        const res = await fetch(
          `http://localhost:80/developer/${userId}/feedbacks`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch feedbacks");

        const data = await res.json();
        setFeedbacks(data);
        console.log("Fetched feedbacks:", data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Feedbacks
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : feedbacks.length === 0 ? (
        <Typography>No feedbacks received yet.</Typography>
      ) : (
        <List>
          {feedbacks.map((fb) => (
            <Paper key={fb.id} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Stack spacing={1}>
                      <Typography variant="body1">{fb.content}</Typography>
                      <Rating value={fb.rating || 0} readOnly />
                    </Stack>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Task: {fb.task?.title || "Unknown"} | Manager:{" "}
                      {fb.givenBy?.name || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DeveloperFeedbacksPage;
