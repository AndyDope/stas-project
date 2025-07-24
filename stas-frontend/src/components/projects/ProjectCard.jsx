import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, LinearProgress, Box } from '@mui/material';

const ProjectCard = ({ project }) => {
  return (
    <Card elevation={3}>
      <CardActionArea component={Link} to={`/projects/${project.id}`}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>{project.title}</Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">{project.status}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" value={project.progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(project.progress)}%`}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;