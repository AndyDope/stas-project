// import React from "react";
// import {
// 	Box,
// 	Typography,
// 	Paper,
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	IconButton,
// 	Button,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";

// const UserManagementPage = () => {
// 	// Mock data - replace with API call
// 	const users = [
// 		{
// 			id: 1,
// 			name: "Alice (Manager)",
// 			email: "manager@test.com",
// 			role: "MANAGER",
// 		},
// 		{ id: 2, name: "Bob (Client)", email: "client@test.com", role: "CLIENT" },
// 		{
// 			id: 3,
// 			name: "Charlie (Developer)",
// 			email: "dev@test.com",
// 			role: "DEVELOPER",
// 		},
// 	];

// 	return (
// 		<Box>
// 			<Box
// 				sx={{
// 					display: "flex",
// 					justifyContent: "space-between",
// 					alignItems: "center",
// 					mb: 3,
// 				}}
// 			>
// 				<Typography variant="h4">User Management</Typography>
// 				<Button variant="contained" startIcon={<AddIcon />}>
// 					Create User
// 				</Button>
// 			</Box>
// 			<Paper>
// 				<TableContainer>
// 					<Table>
// 						<TableHead>
// 							<TableRow>
// 								<TableCell>Name</TableCell>
// 								<TableCell>Email</TableCell>
// 								<TableCell>Role</TableCell>
// 								<TableCell align="right">Actions</TableCell>
// 							</TableRow>
// 						</TableHead>
// 						<TableBody>
// 							{users.map((user) => (
// 								<TableRow key={user.id}>
// 									<TableCell>{user.name}</TableCell>
// 									<TableCell>{user.email}</TableCell>
// 									<TableCell>{user.role}</TableCell>
// 									<TableCell align="right">
// 										<IconButton color="primary">
// 											<EditIcon />
// 										</IconButton>
// 										<IconButton color="error">
// 											<DeleteIcon />
// 										</IconButton>
// 									</TableCell>
// 								</TableRow>
// 							))}
// 						</TableBody>
// 					</Table>
// 				</TableContainer>
// 			</Paper>
// 		</Box>
// 	);
// };

// export default UserManagementPage;

import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import {
	fetchAllUsers,
	updateUser,
	deleteUser,
	createAdminUser,
} from "../services/adminUserService";

import CreateAdminDialog from "./CreateAdminDialog";
import EditUserDialog from "./EditUserDialog";

const UserManagementPage = () => {
	const [users, setUsers] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	//for creating the admin
	const [createOpen, setCreateOpen] = useState(false);
	const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

	//for creating the snakbar alert
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");


	const loadUsers = async () => {
		try {
			const res = await fetchAllUsers();
			setUsers(res.data);
		} catch (err) {
			console.error("Error fetching users", err);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	//for adding the Alert component
	const Alert = React.forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	// ========== Edit User ==========
	const handleEditClick = (user) => {
		setSelectedUser({ ...user });
		setOpen(true);
	};

	const handleDialogClose = () => {
		setOpen(false);
		setSelectedUser(null);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSelectedUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleUpdate = async () => {
		try {
			await updateUser(selectedUser.id, selectedUser);
			handleDialogClose();
			loadUsers();
		} catch (err) {
			console.error("Update failed", err);
		}
	};

	// ========== Delete ==========
	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await deleteUser(id);
				loadUsers();
			} catch (err) {
				console.error("Delete failed", err);
			}
		}
	};

	// ========== Create Admin ==========
	const handleCreateInputChange = (e) => {
		const { name, value } = e.target;
		setNewAdmin((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreateAdmin = async () => {
		try {
			await createAdminUser({
				...newAdmin,
				roleId: 1,
			});
			setCreateOpen(false);
			setNewAdmin({ name: "", email: "", password: "" });
			loadUsers();
			setSnackbarMessage("Admin created successfully!");
			setSnackbarOpen(true);
		} catch (err) {
			setSnackbarMessage("Failed to create admin.");
			setSnackbarOpen(true);
		}
	};

	return (
		<Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Typography variant="h4">User Management</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setCreateOpen(true)}
				>
					Create Admin
				</Button>
			</Box>
			<Paper>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Role</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell align="right">
										<IconButton
											color="primary"
											onClick={() => handleEditClick(user)}
										>
											<EditIcon />
										</IconButton>
										<IconButton
											color="error"
											onClick={() => handleDelete(user.id)}
										>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			{/* Edit Dialog */}
			<EditUserDialog
				open={open}
				user={selectedUser}
				onClose={handleDialogClose}
				onChange={handleInputChange}
				onUpdate={handleUpdate}
			/>

			{/* Create Admin Dialog */}
			<CreateAdminDialog
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				onSubmit={handleCreateAdmin}
				newAdmin={newAdmin}
				onChange={handleCreateInputChange}
			/>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setSnackbarOpen(false)}
					severity="success"
					sx={{ width: "100%", color: "#000" }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default UserManagementPage;