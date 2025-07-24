// src/components/dashboard/StatCard.jsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

const StatCard = ({ title, value, icon }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <Typography color="text.secondary" gutterBottom>{title}</Typography>
        <Typography variant="h4" component="div">{value}</Typography>
      </div>
      {icon}
    </Paper>
  );
};

export default StatCard;