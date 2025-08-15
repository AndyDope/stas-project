import React, { useState, useEffect } from "react";
import {
	Modal,
	Box,
	Typography,
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
import clientService from "../../services/clientService";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "90%", sm: 500 },
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
};

const EditProjectModal = ({ open, onClose, project, onSave, status }) => {
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
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(null);

	// This useEffect pre-fills the form whenever the modal is opened with a new project
	useEffect(() => {
		if (project) {
			setFormData({
				title: project.title || "",
				description: project.description || "",
				endDate: project.endDate || "",
				managerId: project.manager?.id || "",
			});
		}
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
	}, [project, open]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		setSuccess(null);
		try {
			// Call the onSave function passed down from the parent page
			await onSave(formData, "Project updated successfully!");
			onClose(); // Close the modal on success
		} catch (err) {
			setError(err.response?.data || "Failed to update project.");
		} finally {
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
		<Modal open={open} onClose={onClose}>
			<Box sx={style}>
				<Typography variant="h6" component="h2">
					Edit Project Details
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
					<TextField
						name="title"
						label="Project Title"
						value={formData.title}
						onChange={handleChange}
						fullWidth
						required
						margin="normal"
					/>
					<TextField
						name="description"
						label="Project Description"
						value={formData.description}
						onChange={handleChange}
						fullWidth
						required
						multiline
						rows={4}
						margin="normal"
					/>
					<TextField
						name="endDate"
						label="End Date"
						value={formData.endDate}
						onChange={handleChange}
						type="date"
						fullWidth
						required
						margin="normal"
						InputLabelProps={{ shrink: true }}
					/>

					<FormControl
						fullWidth
						margin="normal"
						required
						disabled={status !== "PENDING" && status !== "ONHOLD"}
					>
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
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}
					{success && (
						<Alert severity="success" sx={{ mt: 2, width: "100%" }}>
							{success}
						</Alert>
					)}

					<Box
						sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
					>
						<Button onClick={onClose}>Cancel</Button>
						<Button type="submit" variant="contained" disabled={submitting}>
							{submitting ? <CircularProgress size={24} /> : "Save Changes"}
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default EditProjectModal;
