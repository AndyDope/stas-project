import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

const ManagerReceivedFeedbackPage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const managerId = storedUser?.user?.id;
  const token = storedUser?.token;
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:80/manager/${managerId}/receivedFeedbacks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        console.log(data);
      })
      .catch((err) =>
        console.error("Error loading feedbacks given to manager", err)
      );
  }, [managerId]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Feedbacks Given by Clients on Projects
      </Typography>
      {feedbacks.map((fb, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            Project: {fb.projectTitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Feedback:</strong> {fb.content}
          </Typography>
          <Typography variant="caption">Given by: {fb.client.name}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ManagerReceivedFeedbackPage;
