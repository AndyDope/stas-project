import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import ProjectCard from '../components/projects/ProjectCard';
import AddIcon from '@mui/icons-material/Add';

const ProjectListPage = () => {
  const projects = [
    { id: 1, title: 'New Mobile App', status: 'On Track', progress: 75 },
    { id: 2, title: 'API Refactor', status: 'At Risk', progress: 40 },
    { id: 3, title: 'Marketing Website', status: 'Completed', progress: 100 },
  ];

  return (
		<Box sx={{ width: "100%", px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					justifyContent: "space-between",
					alignItems: { xs: "stretch", sm: "center" },
					mb: 3,
					gap: { xs: 2, sm: 0 },
				}}
			>
				<Typography variant="h4" sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}>
					My Projects
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					sx={{ width: { xs: "100%", sm: "auto" } }}
				>
					Create New Project
				</Button>
			</Box>
			<Grid container spacing={3}>
				{projects.map((project) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						key={project.id}
						sx={{ display: "flex" }}
					>
						<Box sx={{ flex: 1, display: "flex" }}>
							<ProjectCard project={project} />
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default ProjectListPage;