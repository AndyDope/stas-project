import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
} from "@mui/material";

const roles = ["ADMIN", "MANAGER", "DEVELOPER", "CLIENT"];

const EditUserDialog = ({ open, user, onClose, onChange, onUpdate }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Edit User</DialogTitle>
			<DialogContent>
				<TextField
					label="Name"
					name="name"
					fullWidth
					margin="dense"
					value={user?.name || ""}
					onChange={onChange}
				/>
				<TextField
					label="Email"
					name="email"
					fullWidth
					margin="dense"
					value={user?.email || ""}
					onChange={onChange}
				/>
				<TextField
					select
					label="Role"
					name="role"
					fullWidth
					margin="dense"
					value={user?.role || ""}
					onChange={onChange}
				>
					{roles.map((role) => (
						<MenuItem key={role} value={role}>
							{role}
						</MenuItem>
					))}
				</TextField>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={onUpdate}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditUserDialog;