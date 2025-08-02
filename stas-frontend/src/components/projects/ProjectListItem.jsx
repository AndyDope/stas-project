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

const getStatusChipStyles = (status) => {
	const style = { color: "#fff", fontWeight: "bold" };
	switch (status) {
		case "COMPLETED":
			style.backgroundColor = "#10B981";
			break;
		case "ONGOING":
			style.backgroundColor = "#3B82F6";
			break;
		case "PENDING":
			style.backgroundColor = "#F59E0B";
			break;
		case "DELAYED":
		case "AT RISK":
			style.backgroundColor = "#EF4444";
			break;
		case "ONHOLD":
			style.backgroundColor = "#6B7286";
			break;
		default:
			style.backgroundColor = "#9E9E9E";
			break;
	}
	return style;
};

// *** CHANGE 1: Accept a 'role' prop ***
const ProjectListItem = ({ project, role }) => {
	// *** CHANGE 2: Determine the correct link based on the role ***
	const projectLink = `/${role.toLowerCase()}/projects/${project.id}`;

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
								<Typography
									variant="caption"
									display="block"
									align="right"
								>{`${project.completion}% Complete`}</Typography>
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
						// *** CHANGE 3: Use the dynamic link ***
						to={projectLink}
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
