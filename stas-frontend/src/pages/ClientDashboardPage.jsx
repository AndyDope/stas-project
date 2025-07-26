import React from 'react';
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart';

// Import Icons
import FolderIcon from '@mui/icons-material/Folder';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ClientDashboardPage = () => {
  // Mock data - This will be replaced with API calls
  const stats = { total: 12, active: 5, completed: 6, overdue: 1 };
  const recentProjects = [
    { id: 1, title: 'New Mobile App', status: 'In Progress' },
    { id: 2, title: 'Q4 Marketing Campaign', status: 'Completed' },
    { id: 3, title: 'Data Analytics Dashboard', status: 'In Progress' },
    { id: 4, title: 'Cloud Migration', status: 'Completed' },
    { id: 5, title: 'Brand Redesign', status: 'On Hold' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Client Dashboard
      </Typography>

      {/* This is the main Grid container. `spacing={3}` adds gaps between items. */}
      <Grid container spacing={3}>
        
        {/* ROW 1: KPI Stat Cards */}
        {/* On medium (md) screens and up, each card takes 3/12 columns (4 cards in a row) */}
        {/* On extra-small (xs) screens, each card takes 6/12 columns (2 cards in a row) */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Projects" value={stats.total} icon={<FolderIcon color="primary" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Projects" value={stats.active} icon={<SyncIcon color="warning" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Completed Projects" value={stats.completed} icon={<CheckCircleIcon color="success" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Overdue Projects" value={stats.overdue} icon={<ErrorIcon color="error" sx={{ fontSize: 40 }} />} />
        </Grid>

        {/* ROW 2: Chart and List */}
        {/* The Grid system automatically wraps these items to the next line */}
        {/* On medium screens, the chart takes 7/12 columns and the list takes 5/12 */}
        {/* On small screens and below, they each take 12/12 columns (stacking vertically) */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: 380 }}>
            <Typography variant="h6" gutterBottom>Projects Overview</Typography>
            <Box sx={{ height: 'calc(100% - 30px)' }}>
              <ProjectStatusChart data={stats} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Recent Projects</Typography>
            <List sx={{ overflow: 'auto' }}>
              {recentProjects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <ListItem>
                    <ListItemText primary={project.title} secondary={project.status} />
                  </ListItem>
                  {index < recentProjects.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDashboardPage;