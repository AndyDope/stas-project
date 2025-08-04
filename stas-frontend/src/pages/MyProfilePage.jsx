import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const MyProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({ id: '', name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // This useEffect ensures the form is always in sync with the global user state
  useEffect(() => {
    if (user) {
      setProfileData({ id: user.id, name: user.name, email: user.email });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

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

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");
		try {
			await userService.changePassword(passwordData);
			setSuccess("Password changed successfully!");
			setPasswordData({ oldPassword: "", newPassword: "" }); // Clear fields on success
		} catch (err) {
			setError(err.response?.data?.message || "Failed to change password.");
		} finally {
			setLoading(false);
		}
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
				{/* ... Password Change Form ... */}

				{/* Change Password Form */}
				<Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<Paper sx={{ p: 4 }}>
						<Typography variant="h6" gutterBottom>
							Change Password
						</Typography>
						<Box component="form" onSubmit={handlePasswordSubmit}>
							<TextField
								fullWidth
								margin="normal"
								label="Current Password"
								name="oldPassword"
								type="password"
								value={passwordData.oldPassword}
								onChange={handlePasswordChange}
								required
							/>
							<TextField
								fullWidth
								margin="normal"
								label="New Password"
								name="newPassword"
								type="password"
								value={passwordData.newPassword}
								onChange={handlePasswordChange}
								required
							/>
							<Button
								type="submit"
								variant="contained"
								sx={{ mt: 2 }}
								disabled={loading}
							>
								{loading ? <CircularProgress size={24} /> : "Change Password"}
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
			{success && (
				<Alert severity="success" sx={{ mt: 3 }}>
					{success}
				</Alert>
			)}
			{error && (
				<Alert severity="error" sx={{ mt: 3 }}>
					{error}
				</Alert>
			)}
		</Box>
	);
};

export default MyProfilePage;