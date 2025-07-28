import React from "react";
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

const UserManagementPage = () => {
	// Mock data - replace with API call
	const users = [
		{
			id: 1,
			name: "Alice (Manager)",
			email: "manager@test.com",
			role: "MANAGER",
		},
		{ id: 2, name: "Bob (Client)", email: "client@test.com", role: "CLIENT" },
		{
			id: 3,
			name: "Charlie (Developer)",
			email: "dev@test.com",
			role: "DEVELOPER",
		},
	];

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography variant="h4">User Management</Typography>
				<Button variant="contained" startIcon={<AddIcon />}>
					Create User
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
										<IconButton color="primary">
											<EditIcon />
										</IconButton>
										<IconButton color="error">
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
};

export default UserManagementPage;
