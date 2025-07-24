import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ManagerDashboardPage = () => {
  const stats = { activeProjects: 3, teamMembers: 8, openTasks: 25, overdueTasks: 2 };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Manager Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="My Active Projects" value={stats.activeProjects} icon={<AssessmentIcon color="primary" sx={{ fontSize: 40 }} />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="My Team Members" value={stats.teamMembers} icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Open Tasks" value={stats.openTasks} icon={<AssignmentIcon color="primary" sx={{ fontSize: 40 }} />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Overdue Tasks" value={stats.overdueTasks} icon={<ReportProblemIcon color="error" sx={{ fontSize: 40 }} />} /></Grid>
        <Grid item xs={12} md={7}><Paper sx={{ p: 2, height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Typography>Team Workload Bar Chart</Typography></Paper></Grid>
        <Grid item xs={12} md={5}><Paper sx={{ p: 2, height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Typography>Project Status Donut Chart</Typography></Paper></Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboardPage;