import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Pagination, CircularProgress } from "@mui/material";
import ProjectListItem from "../components/projects/ProjectListItem";

// Fetch from backend
const fetchMyProjects = async (managerId, token) => {
  try {
    const response = await fetch(
      `http://localhost:80/manager/${managerId}/myProjects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching manager projects:", error);
    return [];
  }
};

const ITEMS_PER_PAGE = 10;

const MyProjectsPage = () => {
  const [page, setPage] = useState(1);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const managerId = storedUser?.user?.id;
    const token = storedUser?.token;

    if (managerId && token) {
      fetchMyProjects(managerId, token).then((projects) => {
        setAllProjects(projects);
        setLoading(false);
      });
    }
  }, []);

  const pageCount = useMemo(
    () => Math.ceil(allProjects.length / ITEMS_PER_PAGE),
    [allProjects]
  );

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return allProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [page, allProjects]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Projects
      </Typography>

      {/* List of Projects */}
      {paginatedProjects.length > 0 ? (
        <Box>
          {paginatedProjects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </Box>
      ) : (
        <Typography variant="body1">No projects found.</Typography>
      )}

      {/* Pagination Controls */}
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default MyProjectsPage;
