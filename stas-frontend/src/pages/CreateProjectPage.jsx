import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientService from "../services/clientService";
import {
	Box,
	Typography,
	Paper,
	TextField,
	Button,
	CircularProgress,
	Alert,
} from "@mui/material";

const CreateProjectPage = () => {
	// In a real application, you would use useState to manage form state
	// and an onSubmit handler to send the data to the backend.

	const [formData, setFormData] = useState({
		clientId: "",
		title: "",
		description: "",
		completionDate: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await clientService.createNewProject(formData);
			setSuccess("Project request submitted!");
			setTimeout(() => navigate("/client/dashboard"), 2000);
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Could not create new project. Please try again later."
			);
			setIsLoading(false);
		}
	};

	// Use JWT Token to get User info
	useEffect(() => {
		try {
			const storedData = JSON.parse(localStorage.getItem("user"));
			if (storedData && storedData.user) {
				// Use JWT Token to get User info
				setFormData({ ...formData, clientId: storedData.user.id });
			}
		} catch (error) {
			setError("Please login to continue.");
			localStorage.removeItem("user");
			setTimeout(() => navigate("/login"), 2000);
		}
	}, []);

	// const handleSubmit = (event) => {
	// 	event.preventDefault();
	// 	// Logic to submit the project request would go here

	// 	console.log("Project request submitted.");
	// 	// You could show a success message or redirect the user
	// };

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
					<TextField
						required
						name="title"
						fullWidth
						label="Project Title"
						margin="normal"
						value={formData.title}
						onChange={handleChange}
					/>
					<TextField
						required
						name="description"
						fullWidth
						multiline
						rows={6}
						label="Project Description"
						margin="normal"
						placeholder="Describe your project goals, key features, target audience, and any other important details."
						value={formData.description}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						required
						name="completionDate"
						type="date"
						label="Ideal Completion Date"
						margin="normal"
						InputLabelProps={{ shrink: true }}
						value={formData.completionDate}
						onChange={handleChange}
					/>

					{error && (
						<Alert severity="error" sx={{ mt: 2, width: "100%" }}>
							{error}
						</Alert>
					)}
					{success && (
						<Alert severity="success" sx={{ mt: 2, width: "100%" }}>
							{success}
						</Alert>
					)}

					<Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
						{isLoading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							"Submit Project Request"
						)}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default CreateProjectPage;
