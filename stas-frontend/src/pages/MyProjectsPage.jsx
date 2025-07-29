import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Pagination,
	CircularProgress,
	Alert,
} from "@mui/material";
import ProjectListItem from "../components/projects/ProjectListItem";
import clientService from "../services/clientService";

const ITEMS_PER_PAGE = 3;

const MyProjectsPage = () => {
	const [projects, setProjects] = useState([]);
	const [page, setPage] = useState(1); // MUI Pagination is 1-based
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// This useEffect hook re-runs whenever the 'page' state changes
	useEffect(() => {
		const fetchProjects = async () => {
			setLoading(true);
			setError(null);
			try {
				// We subtract 1 from the page because our Spring Boot API is 0-indexed
				const response = await clientService.getProjects(
					page - 1,
					ITEMS_PER_PAGE
				);

				// The backend now returns a Page object with a 'content' array
				setProjects(response.data.content);
				setTotalPages(response.data.totalPages);
			} catch (err) {
				setError("Failed to load projects. Please try again later.");
				console.error("Error fetching projects:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
	}, [page]); // Dependency array: this effect re-runs when 'page' changes

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 3 }}>
				My Projects
			</Typography>

			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{error && (
				<Alert severity="error" sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}

			{!loading && !error && (
				<>
					<Box>
						{projects.length > 0 ? (
							projects.map((project) => (
								<ProjectListItem key={project.id} project={project} />
							))
						) : (
							<Typography sx={{ mt: 4, textAlign: "center" }}>
								You do not have any projects assigned to you yet.
							</Typography>
						)}
					</Box>

					{totalPages > 1 && (
						<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
							<Pagination
								count={totalPages}
								page={page}
								onChange={handlePageChange}
								color="primary"
								size="large"
							/>
						</Box>
					)}
				</>
			)}
		</Box>
	);
};

export default MyProjectsPage;
