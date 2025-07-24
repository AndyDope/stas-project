import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import ProjectCard from '../components/projects/ProjectCard';
import AddIcon from '@mui/icons-material/Add';

const ProjectListPage = () => {
  const projects = [
    { id: 1, title: 'New Mobile App', status: 'On Track', progress: 75 },
    { id: 2, title: 'API Refactor', status: 'At Risk', progress: 40 },
    { id: 3, title: 'Marketing Website', status: 'Completed', progress: 100 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Projects</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Create New Project</Button>
      </Box>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectListPage;