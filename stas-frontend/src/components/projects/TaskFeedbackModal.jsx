import React, { useState } from "react";
import {
	Modal,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Rating,
	TextField,
	Button,
	CircularProgress,
	Alert,
} from "@mui/material";
import feedbackService from "../../services/feedbackService";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 450,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
};

const TaskFeedbackModal = ({ open, onClose, tasks, members }) => {
	const [formData, setFormData] = useState({
		taskId: "",
		recipientId: "",
		rating: 0,
		content: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError("");
		setSuccess("");
		try {
			await feedbackService.submitFeedback(formData);
			setSuccess("Feedback submitted successfully!");
			setTimeout(() => {
				handleClose();
			}, 1500);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to submit feedback.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleClose = () => {
		setFormData({ taskId: "", recipientId: "", rating: 0, content: "" });
		setError("");
		setSuccess("");
		onClose();
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={style}>
				<Typography variant="h6" component="h2">
					Give Task Feedback
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
					<FormControl fullWidth margin="normal" required>
						<InputLabel>Select Task</InputLabel>
						<Select
							name="taskId"
							value={formData.taskId}
							label="Select Task"
							onChange={handleChange}
						>
							{tasks.map((t) => (
								<MenuItem key={t.id} value={t.id}>
									{t.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth margin="normal" required>
						<InputLabel>Select Developer</InputLabel>
						<Select
							name="recipientId"
							value={formData.recipientId}
							label="Select Developer"
							onChange={handleChange}
						>
							{members.map((m) => (
								<MenuItem key={m.id} value={m.id}>
									{m.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Typography component="legend" sx={{ mt: 2 }}>
						Rating
					</Typography>
					<Rating
						name="rating"
						value={Number(formData.rating)}
						onChange={(e, newVal) =>
							setFormData({ ...formData, rating: newVal })
						}
					/>
					<TextField
						fullWidth
						multiline
						rows={4}
						margin="normal"
						label="Feedback"
						name="content"
						value={formData.content}
						onChange={handleChange}
						required
					/>
					{success && (
						<Alert severity="success" sx={{ mt: 1 }}>
							{success}
						</Alert>
					)}
					{error && (
						<Alert severity="error" sx={{ mt: 1 }}>
							{error}
						</Alert>
					)}
					<Box
						sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
					>
						<Button onClick={handleClose}>Cancel</Button>
						<Button type="submit" variant="contained" disabled={submitting}>
							{submitting ? <CircularProgress size={24} /> : "Submit"}
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default TaskFeedbackModal;
