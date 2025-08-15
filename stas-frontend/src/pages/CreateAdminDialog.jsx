import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
} from "@mui/material";

const CreateAdminDialog = ({ open, onClose, onSubmit, newAdmin, onChange }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Create Admin</DialogTitle>
			<DialogContent>
				<TextField
					label="Name"
					name="name"
					fullWidth
					margin="dense"
					value={newAdmin.name}
					onChange={onChange}
				/>
				<TextField
					label="Email"
					name="email"
					fullWidth
					margin="dense"
					value={newAdmin.email}
					onChange={onChange}
				/>
				<TextField
					label="Password"
					name="password"
					type="password"
					fullWidth
					margin="dense"
					value={newAdmin.password}
					onChange={onChange}
				/>
				<TextField
					label="Role"
					fullWidth
					margin="dense"
					value="ADMIN"
					disabled
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={onSubmit}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateAdminDialog;