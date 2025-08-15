import React from "react";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "At Risk":
      return "warning";
    case "On Hold":
      return "default";
    default:
      return "primary";
  }
};

const ManagerProjectListItem = ({ project }) => {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Title & Status */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ color: "#37474f", flexGrow: 1 }}>
              {project.title}
            </Typography>
            <Chip
              label={project.status}
              color={getStatusColor(project.status)}
              size="small"
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#607d8b" }}>
            {project.description}
          </Typography>
        </Grid>

        {/* Tasks & Members */}
        <Grid item xs={12} sm={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box textAlign="center">
              <Typography
                variant="subtitle1"
                sx={{ color: "#455a64", fontWeight: 600 }}
              >
                {project.openTasks}
              </Typography>
              <Typography variant="caption" sx={{ color: "#78909c" }}>
                Open Tasks
              </Typography>
            </Box>
            <AvatarGroup max={4}>
              {project.members.map((m) => {
                // Generate a random avatar if none provided
                const randomImg = `https://i.pravatar.cc/150?img=${
                  Math.floor(Math.random() * 70) + 1
                }`;
                return (
                  <Avatar
                    key={m.id}
                    src={m.avatarUrl || randomImg}
                    alt={m.name}
                  />
                );
              })}
            </AvatarGroup>
          </Box>
        </Grid>

        {/* Action */}
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ textAlign: { xs: "left", sm: "right" } }}
        >
          <Button
            variant="contained"
            endIcon={<OpenInNewIcon />}
            onClick={() => navigate(`/manager/projects/${project.id}`)}
            size="small"
          >
            View
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ManagerProjectListItem;
