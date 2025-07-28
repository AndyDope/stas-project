import React, { useState, useMemo } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import ProjectListItem from "../components/projects/ProjectListItem";

// Mock Data - replace with a single API call in a useEffect hook
const allProjects = [
  // Populate with at least 11 projects to test pagination
  {
    id: 1,
    title: "New Mobile App",
    description: "The official app for our new product launch.",
    status: "On Track",
    openTasks: 8,
    completion: 75,
    members: [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ],
  },
  {
    id: 2,
    title: "API Refactor",
    description: "Migrating the legacy API to a new microservice architecture.",
    status: "At Risk",
    openTasks: 12,
    completion: 40,
    members: [
      { id: 1, name: "A" },
      { id: 3, name: "C" },
    ],
  },
  {
    id: 3,
    title: "Marketing Website",
    description: "A complete redesign of the public-facing website.",
    status: "Completed",
    openTasks: 0,
    completion: 100,
    members: [{ id: 4, name: "D" }],
  },
  // ... add 8 more mock projects
  {
    id: 4,
    title: "Project Alpha",
    description: "Description for Alpha.",
    status: "On Track",
    openTasks: 5,
    completion: 60,
    members: [{ id: 1, name: "A" }],
  },
  {
    id: 5,
    title: "Project Bravo",
    description: "Description for Bravo.",
    status: "On Hold",
    openTasks: 2,
    completion: 20,
    members: [{ id: 2, name: "B" }],
  },
  {
    id: 6,
    title: "Project Charlie",
    description: "Description for Charlie.",
    status: "Completed",
    openTasks: 0,
    completion: 100,
    members: [{ id: 3, name: "C" }],
  },
  {
    id: 7,
    title: "Project Delta",
    description: "Description for Delta.",
    status: "On Track",
    openTasks: 9,
    completion: 80,
    members: [
      { id: 1, name: "A" },
      { id: 4, name: "D" },
    ],
  },
  {
    id: 8,
    title: "Project Echo",
    description: "Description for Echo.",
    status: "At Risk",
    openTasks: 15,
    completion: 30,
    members: [{ id: 2, name: "B" }],
  },
  {
    id: 9,
    title: "Project Foxtrot",
    description: "Description for Foxtrot.",
    status: "On Track",
    openTasks: 3,
    completion: 95,
    members: [{ id: 1, name: "A" }],
  },
  {
    id: 10,
    title: "Project Golf",
    description: "Description for Golf.",
    status: "Completed",
    openTasks: 0,
    completion: 100,
    members: [{ id: 3, name: "C" }],
  },
  {
    id: 11,
    title: "Project Hotel",
    description: "Description for Hotel.",
    status: "On Track",
    openTasks: 7,
    completion: 50,
    members: [
      { id: 2, name: "B" },
      { id: 4, name: "D" },
    ],
  },
];

const ITEMS_PER_PAGE = 10;

const MyProjectsPage = () => {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(allProjects.length / ITEMS_PER_PAGE);

  // useMemo prevents recalculating the slice on every render, optimizing performance
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return allProjects.slice(start, end);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Projects
      </Typography>

      {/* List of Projects */}
      <Box>
        {paginatedProjects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </Box>

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default MyProjectsPage;
