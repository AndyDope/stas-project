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
	FormControl,
	InputLabel,
	Select,
	ListSubheader,
	Divider,
	MenuItem,
} from "@mui/material";

const CreateProjectPage = () => {
	// In a real application, you would use useState to manage form state
	// and an onSubmit handler to send the data to the backend.

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		endDate: "",
		managerId: "",
	});
	const [managers, setManagers] = useState({
		available: [],
		busy: [],
		tooBusy: [],
	});
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchManagers = async () => {
			try {
				setLoading(true);
				const response = await clientService.getAvailableManagers();
				const rawManagers = response.data;

				// Process and group managers based on project count
				const available = rawManagers
					.filter((m) => m.projectCount <= 2)
					.sort((a, b) => a.projectCount - b.projectCount);
				const busy = rawManagers
					.filter((m) => m.projectCount >= 3 && m.projectCount <= 4)
					.sort((a, b) => a.projectCount - b.projectCount);
				const tooBusy = rawManagers
					.filter((m) => m.projectCount > 4)
					.sort((a, b) => a.projectCount - b.projectCount);

				setManagers({ available, busy, tooBusy });
			} catch (err) {
				setError("Failed to load available managers.");
			} finally {
				setLoading(false);
			}
		};
		fetchManagers();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		setSuccess(null);

		try {
			await clientService.createNewProject(formData);
			setSuccess("Project request submitted successfully!");
			setTimeout(() => navigate("/client/dashboard"), 2000);
		} catch (err) {
			setError(
				err.response?.data ||
					"Failed to submit project. Please try again later."
			);
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

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
						rows={4}
						label="Project Description"
						margin="normal"
						placeholder="Describe your project goals, key features, target audience, and any other important details."
						value={formData.description}
						onChange={handleChange}
					/>
					<TextField
						fullWidth
						required
						name="endDate"
						type="date"
						label="Ideal Completion Date"
						margin="normal"
						InputLabelProps={{ shrink: true }}
						value={formData.completionDate}
						onChange={handleChange}
					/>

					<FormControl fullWidth margin="normal" required>
						<InputLabel id="manager-select-label">Assign a Manager</InputLabel>
						<Select
							labelId="manager-select-label"
							name="managerId"
							value={formData.managerId}
							label="Assign a Manager"
							onChange={handleChange}
						>
							<ListSubheader sx={{ color: "success.main", fontWeight: "bold" }}>
								Available ({managers.available.length})
							</ListSubheader>
							{managers.available.map((m) => (
								<MenuItem key={m.id} value={m.id}>
									{m.name} ({m.projectCount} projects)
								</MenuItem>
							))}

							<Divider />
							<ListSubheader sx={{ color: "warning.main", fontWeight: "bold" }}>
								Busy ({managers.busy.length})
							</ListSubheader>
							{managers.busy.map((m) => (
								<MenuItem key={m.id} value={m.id}>
									{m.name} ({m.projectCount} projects)
								</MenuItem>
							))}

							<Divider />
							<ListSubheader sx={{ color: "error.main", fontWeight: "bold" }}>
								Too Busy ({managers.tooBusy.length})
							</ListSubheader>
							{managers.tooBusy.map((m) => (
								<MenuItem key={m.id} value={m.id} disabled>
									{m.name} ({m.projectCount} projects)
								</MenuItem>
							))}
						</Select>
					</FormControl>

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

					<Button
						type="submit"
						variant="contained"
						size="large"
						sx={{ mt: 3 }}
						disabled={submitting}
					>
						{submitting ? (
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
