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

const getStatusChipColor = (status) => {
	switch (status) {
		case "Completed":
			return "success";
		case "At Risk":
			return "warning";
		case "On Hold":
			return "default";
		default:
			return "primary";
	}
};

const ProjectListItem = ({ project }) => {
	return (
		<Paper elevation={3} sx={{ p: 3, mb: 3 }}>
			<Grid container spacing={2} alignItems="center">
				{/* Left Side: Title, Status, Description */}
				<Grid item xs={12} md={6}>
					<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<Typography variant="h5" component="div" sx={{ mr: 2 }}>
							{project.title}
						</Typography>
						<Chip
							label={project.status}
							color={getStatusChipColor(project.status)}
							size="small"
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
								{project.members.map((member) => (
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
						to={`/manager/projects/${project.id}`}
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
