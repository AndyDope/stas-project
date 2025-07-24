import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const columns = ["Backlog", "To Do", "In Progress", "In Review", "Done"];

const TaskCard = ({ task }) => (
  <Paper
    elevation={2}
    sx={{ p: 2, mb: 2, "&:hover": { bgcolor: "action.hover" } }}
  >
    <Typography>{task.title}</Typography>
  </Paper>
);

const KanbanBoard = () => {
  const tasks = [
    { id: 1, title: "Setup database schema", status: "Done" },
    { id: 2, title: "Create login API", status: "In Review" },
    { id: 3, title: "Build login page UI", status: "In Progress" },
    { id: 4, title: "Implement JWT", status: "In Progress" },
    { id: 5, title: "Add project creation form", status: "To Do" },
    { id: 6, title: "Design the main dashboard", status: "Backlog" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        p: 1,
        minHeight: "60vh",
      }}
    >
      {columns.map((columnName) => (
        <Paper
          key={columnName}
          sx={{ p: 2, width: 300, flexShrink: 0, bgcolor: "#F8F9FA" }}
        >
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            {columnName}
          </Typography>
          {tasks
            .filter((task) => task.status === columnName)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </Paper>
      ))}
    </Box>
  );
};

export default KanbanBoard;
