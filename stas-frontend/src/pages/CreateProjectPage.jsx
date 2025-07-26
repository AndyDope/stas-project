import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const CreateProjectPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Create a New Project</Typography>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>Project Details</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill out the form below and our team will get back to you shortly to assign a manager and get started.
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField required fullWidth label="Project Title" margin="normal" />
          <TextField required fullWidth multiline rows={6} label="Project Description" margin="normal" placeholder="Describe your project goals, key features, and any other important details." />
          <TextField fullWidth type="date" label="Ideal Completion Date" margin="normal" InputLabelProps={{ shrink: true }} />
          <Button variant="contained" size="large" sx={{ mt: 3 }}>Submit Project Request</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProjectPage;
