import React from "react";
import { Link } from "react-router-dom";
import {
	Paper,
	Grid,
	Typography,
	Box,
	Chip,
	LinearProgress,
	Button,
	Avatar,
	AvatarGroup,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// *** THIS IS THE UPDATED FUNCTION ***
// It now returns a style object with specific background colors to match your chart.
const getStatusChipStyles = (status) => {
	// Default style for unknown statuses
	const style = {
		color: "#fff", // White text for good contrast
		fontWeight: "bold",
	};

	switch (status) {
		case "COMPLETED":
			style.backgroundColor = "#10B981"; // Green
			break;
		case "ONGOING": // This is the backend equivalent of 'Active'
			style.backgroundColor = "#3B82F6"; // Blue
			break;
		case "PENDING":
			style.backgroundColor = "#F59E0B"; // Amber
			break;
		case "DELAYED": // Assuming 'DELAYED' or 'AT RISK' corresponds to 'Overdue'
		case "AT RISK":
			style.backgroundColor = "#EF4444"; // Red
			break;
		case "ONHOLD":
			style.backgroundColor = "#6B7286"; // Medium Gray
			break;
		default:
			style.backgroundColor = "#9E9E9E"; // A neutral gray
			break;
	}
	return style;
};

const ProjectListItem = ({ project }) => {
	return (
		<Paper elevation={3} sx={{ p: 3, mb: 3 }}>
			<Grid container spacing={2} alignItems="center">
				{/* Left Side: Title, Status, Description */}
				<Grid item xs={12} md={6}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							mb: 1,
							flexWrap: "wrap",
							gap: 2,
						}}
					>
						<Typography variant="h5" component="div">
							{project.title}
						</Typography>
						{/* THIS IS THE CHANGE: We now use the `sx` prop to apply our custom styles */}
						<Chip
							label={project.status}
							size="small"
							sx={getStatusChipStyles(project.status)}
						/>
					</Box>
					<Typography variant="body2" color="text.secondary">
						{project.description}
					</Typography>
				</Grid>

				{/* Right Side: Stats and Members */}
				<Grid item xs={12} md={6}>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={6} sm={3}>
							<Typography align="center">
								<strong>{project.openTasks}</strong>
								<br />
								Open Tasks
							</Typography>
						</Grid>
						<Grid item xs={6} sm={4}>
							<AvatarGroup max={4} sx={{ justifyContent: "center" }}>
								{project.members &&
									project.members.map((member) => (
										<Avatar
											key={member.id}
											alt={member.name}
											src={member.avatarUrl}
										/>
									))}
							</AvatarGroup>
						</Grid>
						<Grid item xs={12} sm={5}>
							<Box sx={{ width: "100%" }}>
								<LinearProgress
									variant="determinate"
									value={project.completion}
									sx={{ height: 8, borderRadius: 5 }}
								/>
								<Typography variant="caption" display="block" align="right">
									{`${project.completion}% Complete`}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Grid>

				{/* Action Button */}
				<Grid
					item
					xs={12}
					sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
				>
					<Button
						component={Link}
						to={`/client/projects/${project.id}`}
						variant="contained"
						endIcon={<OpenInNewIcon />}
					>
						Open Project
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default ProjectListItem;
