import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from "@mui/material";

const EditProfileDialog = ({ open, handleClose, profileData, onUpdate }) => {
	const [form, setForm] = useState({ name: "", email: "" });

	useEffect(() => {
		if (profileData) {
			setForm(profileData);
		}
	}, [profileData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = () => {
		onUpdate(form);
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Edit Profile</DialogTitle>
			<DialogContent>
				<TextField
					margin="dense"
					name="name"
					label="Full Name"
					fullWidth
					value={form.name}
					onChange={handleChange}
				/>
				<TextField
					margin="dense"
					name="email"
					label="Email"
					type="email"
					fullWidth
					value={form.email}
					onChange={handleChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button variant="contained" onClick={handleSubmit}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditProfileDialog;