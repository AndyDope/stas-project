import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useDragToScroll } from "../../hooks/useDragToScroll";

// Kanban column titles
const columns = ["Overdue", "Pending", "In Progress", "In Review", "Done"];

// Mapping from backend statuses to Kanban columns
const statusToColumnMap = {
  PENDING: "Pending",
  OVERDUE: "Overdue",
  ACTIVE: "In Progress",
  INREVIEW: "In Review",
  COMPLETED: "Done",
};

// Task card UI
const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/developer/edit-task/${task.id}`);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {task.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {task.description}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Due: {task.dueDate}
          </Typography>
        </Box>

        <Tooltip title="Edit Task">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

// Main Kanban Board
const KanbanBoard = ({ initialTasks }) => {
  const scrollRef = useDragToScroll();

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        gap: 2,
        p: 1,
        pb: 2,
        overflowX: "auto",
        cursor: "grab",
        "&::-webkit-scrollbar": {
          height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {columns.map((columnName) => (
        <Paper
          key={columnName}
          sx={{
            p: 2,
            width: { xs: 280, sm: 300 },
            flexShrink: 0,
            bgcolor: "#F8F9FA",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            {columnName}
          </Typography>
          {initialTasks
            .filter((task) => statusToColumnMap[task.status] === columnName)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </Paper>
      ))}
    </Box>
  );
};

export default KanbanBoard;
