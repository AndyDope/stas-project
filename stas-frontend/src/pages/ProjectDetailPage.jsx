import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/projects/KanbanBoard';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const project = { title: 'New Mobile App', description: 'The official app for our new product launch.' };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">{project.title}</Typography>
        <Typography color="text.secondary">{project.description}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
        <Button variant="outlined" startIcon={<PeopleOutlineIcon />}>Manage Team</Button>
        <Button variant="contained" startIcon={<AddTaskIcon />}>Create Task</Button>
      </Box>
      <KanbanBoard />
    </Box>
  );
};

export default ProjectDetailPage;