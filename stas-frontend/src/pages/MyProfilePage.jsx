import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditProfileDialog from "./EditProfileDialog";

const MyProfilePage = () => {
	const { user, updateUser } = useAuth();
	const [profileData, setProfileData] = useState({ id: '', name: '', email: '' });
	const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [passwordLoading, setPasswordLoading] = useState(false);

	// This useEffect ensures the form is always in sync with the global user state
	useEffect(() => {
		if (user) {
			setProfileData({ id: user.id, name: user.name, email: user.email });
		}
	}, [user]);



	const handleProfileChange = (e) => {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	};

	const [isEditing, setIsEditing] = useState(false);

	const handleProfileSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");
		try {
			// Assuming the backend API returns the fully updated user object
			const response = await userService.updateMyProfile(profileData);
			updateUser(response.data); // Update the global state

			setSuccess("Profile updated successfully!");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to update profile.");
		} finally {
			setLoading(false);
		}
	};
	const [editOpen, setEditOpen] = useState(false);

	// ----------------------------------------------------------------------------------------------------
	const handlePasswordChange = (e) => {
		setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
	};

	const [showPasswords, setShowPasswords] = useState({
		old: false,
		new: false,
		confirm: false,
	});

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		setPasswordLoading(true);

		if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			setSnackbar({ open: true, message: "All fields are required.", severity: "warning" });
			setPasswordLoading(false);
			return;
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setSnackbar({ open: true, message: "New passwords do not match.", severity: "error" });
			setPasswordLoading(false);
			return;
		}
		if (passwordData.oldPassword === passwordData.newPassword) {
			setSnackbar({ open: true, message: "New password must be different.", severity: "warning" });
			setPasswordLoading(false);
			return;
		}

		try {
			await userService.changePassword(passwordData);
			setSnackbar({ open: true, message: "Password changed successfully!", severity: "success" });
			setTimeout(() => {
				setSnackbar((prev) => ({ ...prev, open: false }));
			}, 3000); // optional: auto close fallback
			setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || "Failed to change password.",
				severity: "error",
			});
		} finally {
			setPasswordLoading(false);
		}
	};

	const togglePasswordVisibility = (field) => {
		setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleSnackbarClose = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				My Profile
			</Typography>
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<Paper sx={{ p: 4 }}>
						<Typography variant="h6" gutterBottom>
							Profile Information
						</Typography>
						<Box component="form" onSubmit={handleProfileSubmit}>
							<TextField
								fullWidth
								margin="normal"
								label="Full Name"
								name="name"
								value={profileData.name}
								onChange={handleProfileChange}
								required
							/>
							<TextField
								fullWidth
								margin="normal"
								label="Email Address"
								name="email"
								type="email"
								value={profileData.email}
								onChange={handleProfileChange}
								required
							/>
							<Button
								type="submit"
								variant="contained"
								sx={{ mt: 2 }}
								disabled={loading}
							>
								{loading ? <CircularProgress size={24} /> : "Save Changes"}
							</Button>
						</Box>
					</Paper>
				</Grid>

				{/* Change Password Form */}
				<Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<Paper sx={{ p: 4 }}>
						<Typography variant="h6" gutterBottom>
							Change Password
						</Typography>
						<Box component="form" onSubmit={handlePasswordSubmit}>
							{["oldPassword", "newPassword", "confirmPassword"].map(
								(field, i) => (
									<TextField
										key={field}
										fullWidth
										margin="normal"
										label={
											field === "oldPassword"
												? "Current Password"
												: field === "newPassword"
												? "New Password"
												: "Confirm New Password"
										}
										name={field}
										type={
											showPasswords[field.replace("Password", "")]
												? "text"
												: "password"
										}
										value={passwordData[field]}
										onChange={handlePasswordChange}
										required
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={() =>
															togglePasswordVisibility(
																field.replace("Password", "")
															)
														}
														edge="end"
													>
														{showPasswords[field.replace("Password", "")] ? (
															<VisibilityOff />
														) : (
															<Visibility />
														)}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								)
							)}
							<Button
								type="submit"
								variant="contained"
								sx={{ mt: 2 }}
								disabled={passwordLoading}
							>
								{passwordLoading ? (
									<CircularProgress size={24} />
								) : (
									"Change Password"
								)}
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default MyProfilePage;