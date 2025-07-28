import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	CircularProgress,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Paper,
} from "@mui/material";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		roleId: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			await authService.register(formData);
			setSuccess(
				"Registration successful! Redirecting to login in 2 seconds..."
			);
			setTimeout(() => navigate("/login"), 2000);
		} catch (err) {
			setError(
				err.response?.data?.message || "Registration failed. Please try again."
			);
			setIsLoading(false);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper
				elevation={6}
				sx={{
					marginTop: 8,
					padding: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h4">
					Create Account
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
					<TextField
						name="name"
						label="Full Name"
						required
						fullWidth
						autoFocus
						margin="normal"
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						name="email"
						label="Email Address"
						type="email"
						required
						fullWidth
						margin="normal"
						value={formData.email}
						onChange={handleChange}
					/>
					<TextField
						name="password"
						label="Password"
						type="password"
						required
						fullWidth
						margin="normal"
						value={formData.password}
						onChange={handleChange}
					/>
					<FormControl fullWidth margin="normal" required>
						<InputLabel id="role-select-label">Register as a...</InputLabel>
						<Select
							labelId="role-select-label"
							name="roleId"
							value={formData.roleId}
							label="Register as a..."
							onChange={handleChange}
						>
							{/* These values must match the IDs in your backend `roles` table */}
							<MenuItem value={2}>Client</MenuItem>
							<MenuItem value={3}>Manager</MenuItem>
							<MenuItem value={4}>Developer</MenuItem>
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
						fullWidth
						variant="contained"
						disabled={isLoading || success}
						sx={{ mt: 3, mb: 2, py: 1.5 }}
					>
						{isLoading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							"Sign Up"
						)}
					</Button>

					<Box textAlign="center">
						<Typography variant="body2">
							Already have an account?{" "}
							<Link
								to="/login"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								Sign In
							</Link>
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default RegisterPage;
