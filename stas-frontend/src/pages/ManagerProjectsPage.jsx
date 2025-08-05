import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Paper,
  Divider,
  Container,
} from "@mui/material";
import ManagerProjectListItem from "../components/projects/ManagerProjectListItem";

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

const ManagerProjectsPage = () => {
  const [page, setPage] = useState(1);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const managerId = storedUser?.user?.id;
    const token = storedUser?.token;

    if (managerId && token) {
      fetchMyProjects(managerId, token).then((projects) => {
        const sortedProjects = projects.sort((a, b) => {
          const isACompleted = a.status === "COMPLETED";
          const isBCompleted = b.status === "COMPLETED";

          if (isACompleted && !isBCompleted) return 1;
          if (!isACompleted && isBCompleted) return -1;

          return new Date(a.startDate) - new Date(b.startDate);
        });

        setAllProjects(sortedProjects);
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
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          <CircularProgress
            size={40}
            sx={{
              color: "#1976d2",
            }}
          />
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              mb: 1,
            }}
          >
            My Projects
          </Typography>
          <Divider sx={{ borderColor: "#e0e0e0" }} />
        </Box>

        {/* Projects List */}
        {paginatedProjects.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {paginatedProjects.map((project) => (
              <Paper
                key={project.id}
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <ManagerProjectListItem project={project} />
              </Paper>
            ))}
          </Box>
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              borderRadius: 2,
              backgroundColor: "#ffffff",
              border: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                fontWeight: 500,
                mb: 1,
              }}
            >
              No projects found
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#999",
              }}
            >
              Your projects will appear here once they're created.
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#666",
                  fontWeight: 500,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#ccc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    borderColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ManagerProjectsPage;
