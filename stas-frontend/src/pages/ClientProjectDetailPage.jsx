import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Paper,
	Grid,
	LinearProgress,
	Chip,
	Avatar,
	AvatarGroup,
	List,
	ListItem,
	ListItemText,
	Divider,
	CircularProgress,
	Alert,
	Button,
} from "@mui/material";
import clientService from "../services/clientService";
import RateReviewIcon from "@mui/icons-material/RateReview";

// Helper for Project status (no change here)
const getProjectStatusChipColor = (status) => {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "ONGOING":
			return "primary";
		case "PENDING":
			return "warning";
		default:
			return "default";
	}
};
const getChipStyle = () => {
	const style = {
		color: "#fff",
		fontWeight: "bold",
	};
	return style;
};

// *** THIS IS THE UPDATED FUNCTION FOR TASK STATUSES ***
// It now returns a style object with a custom background color,
// white text, and bold font weight.
const getTaskStatusChipColor = (status) => {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "ACTIVE":
			return "primary";
		case "PENDING":
			return "warning";
		case "OVERDUE":
			return "error";
		default:
			return "default";
	}
};

const ClientProjectDetailPage = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProjectDetails = async () => {
			try {
				const response = await clientService.getProjectById(projectId);
				setProject(response.data);
			} catch (err) {
				setError("Failed to load project details.");
			} finally {
				setLoading(false);
			}
		};
		fetchProjectDetails();
	}, [projectId]);

	const handleGiveFeedbackClick = () => {
		// Navigate to the feedback page and pass the project ID in the state
		navigate("/client/feedback", { state: { selectedProjectId: project.id } });
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	if (!project) {
		return <Alert severity="info">Project details not found.</Alert>;
	}

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexWrap: "wrap",
						gap: 2,
						mb: 1,
					}}
				>
					<Typography variant="h4">{project.title}</Typography>
					<Chip
						label={project.status}
						sx={getChipStyle()}
						color={getProjectStatusChipColor(project.status)}
					/>
					{project.status === "COMPLETED" && (
						<Button
							variant="contained"
							color="primary"
							startIcon={<RateReviewIcon />}
							onClick={handleGiveFeedbackClick}
							sx={{
								width: { xs: "100%", sm: "auto" },
								mt: { xs: 2, sm: 0 },
							}}
						>
							Give Feedback
						</Button>
					)}
				</Box>
				<Typography color="text.secondary">{project.description}</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 4, lg: 3 }}>
					<Paper sx={{ p: 3, height: "100%" }}>
						<Typography variant="h6" gutterBottom>
							Project Progress
						</Typography>
						<Box sx={{ width: "100%", mb: 4 }}>
							<LinearProgress
								variant="determinate"
								value={project.completion}
								sx={{ height: 10, borderRadius: 5 }}
							/>
							<Typography
								variant="body2"
								display="block"
								align="center"
								sx={{ mt: 1 }}
							>
								{`${project.completion}% Complete`}
							</Typography>
						</Box>
						<Divider sx={{ my: 3 }} />
						<Typography variant="h6" gutterBottom>
							Project Team
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							Managed by:{" "}
							<strong>
								{project.manager ? project.manager.name : "Pending Assignment"}
							</strong>
						</Typography>
						<AvatarGroup max={6}>
							{project.teamMembers &&
								project.teamMembers.map((member) => (
									<Avatar
										key={member.id}
										alt={member.name}
										src={member.avatarUrl}
									/>
								))}
						</AvatarGroup>
					</Paper>
				</Grid>

				<Grid size={{ xs: 12, md: 8, lg: 6 }}>
					<Paper
						sx={{
							p: 2,
							height: "100%",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Typography variant="h6" gutterBottom sx={{ px: 2, pt: 1 }}>
							Task Status
						</Typography>
						<List sx={{ overflow: "auto" }}>
							{project.tasks && project.tasks.length > 0 ? (
								project.tasks.map((task, index) => (
									<React.Fragment key={task.id}>
										<ListItem
											secondaryAction={
												// *** THIS IS THE CHANGE ***
												// We replace the `color` prop with the `sx` prop
												// and use our new styling function.
												<Chip
													label={task.status}
													size="small"
													sx={getChipStyle()}
													color={getTaskStatusChipColor(task.status)}
												/>
											}
										>
											<ListItemText
												primary={task.title}
												sx={{
													marginRight: "120px",
													"& .MuiListItemText-primary": {
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
													},
												}}
											/>
										</ListItem>
										{index < project.tasks.length - 1 && <Divider />}
									</React.Fragment>
								))
							) : (
								<Typography sx={{ p: 2, color: "text.secondary" }}>
									No tasks have been created for this project yet.
								</Typography>
							)}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ClientProjectDetailPage;
