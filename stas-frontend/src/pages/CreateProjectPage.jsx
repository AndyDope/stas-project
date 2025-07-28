import React from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

const CreateProjectPage = () => {
	// In a real application, you would use useState to manage form state
	// and an onSubmit handler to send the data to the backend.

	const handleSubmit = (event) => {
		event.preventDefault();
		// Logic to submit the project request would go here
		console.log("Project request submitted.");
		// You could show a success message or redirect the user
	};

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Submit a New Project Request
			</Typography>
			<Paper sx={{ p: { xs: 2, sm: 4 } }}>
				<Typography variant="h6" gutterBottom>
					Project Details
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Fill out the form below with as much detail as possible. Our team will
					review your request and assign a Project Manager to get started.
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					autoComplete="off"
				>
					<TextField required fullWidth label="Project Title" margin="normal" />
					<TextField
						required
						fullWidth
						multiline
						rows={6}
						label="Project Description"
						margin="normal"
						placeholder="Describe your project goals, key features, target audience, and any other important details."
					/>
					<TextField
						fullWidth
						type="date"
						label="Ideal Completion Date"
						margin="normal"
						InputLabelProps={{ shrink: true }}
					/>
					<Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
						Submit Project Request
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default CreateProjectPage;
