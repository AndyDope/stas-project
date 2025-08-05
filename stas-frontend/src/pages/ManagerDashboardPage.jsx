import React, { useEffect, useState } from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const StatCard = ({ title, value, icon, color = "gray" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorStyles = {
    gray: {
      backgroundColor: "#f8fafc",
      borderColor: "#e2e8f0",
      iconColor: "#64748b",
    },
    blue: {
      backgroundColor: "#eff6ff",
      borderColor: "#dbeafe",
      iconColor: "#2563eb",
    },
    green: {
      backgroundColor: "#ecfdf5",
      borderColor: "#d1fae5",
      iconColor: "#059669",
    },
    purple: {
      backgroundColor: "#faf5ff",
      borderColor: "#e9d5ff",
      iconColor: "#9333ea",
    },
    red: {
      backgroundColor: "#fef2f2",
      borderColor: "#fecaca",
      iconColor: "#dc2626",
    },
  };

  const cardStyle = {
    backgroundColor: colorStyles[color].backgroundColor,
    border: `1px solid ${colorStyles[color].borderColor}`,
    borderRadius: "8px",
    padding: "24px",
    transition: "all 0.2s ease",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "500",
              margin: 0,
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1f2937",
              marginTop: "8px",
              margin: "8px 0 0 0",
            }}
          >
            {value}
          </p>
        </div>
        <div style={{ color: colorStyles[color].iconColor }}>
          {React.cloneElement(icon, {
            sx: { fontSize: 24, color: colorStyles[color].iconColor },
          })}
        </div>
      </div>
    </div>
  );
};

const fetchManagerStats = async (managerId, token) => {
  const response = await fetch(
    `http://localhost:80/manager/${managerId}/managerstats`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch stats");
  return await response.json();
};

const fetchTeamWorkload = async (managerId, token) => {
  const response = await fetch(
    `http://localhost:80/manager/${managerId}/teamWorkload`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch workload");
  return await response.json();
};

const fetchHighPriorityTasks = async (managerId, token) => {
  const response = await fetch(
    `http://localhost:80/manager/${managerId}/highProirity`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return await response.json();
};

const ManagerDashboardPage = () => {
  const [stats, setStats] = useState({
    myProjects: 0,
    teamMembers: 0,
    openTasks: 0,
    overdueTasks: 0,
  });

  const [highPriorityTasks, setHighPriorityTasks] = useState([]);
  const [teamWorkload, setTeamWorkload] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
    const managerId = storedUser?.user?.id;
    const token = storedUser?.token;

    if (managerId) {
      fetchManagerStats(managerId, token)
        .then((data) =>
          setStats({
            myProjects: data.totalProject || 0,
            teamMembers: data.teamMember || 0,
            openTasks: data.openTask || 0,
            overdueTasks: data.overdueTask || 0,
          })
        )
        .catch(console.error);

      fetchTeamWorkload(managerId, token)
        .then((data) => setTeamWorkload(data || []))
        .catch(console.error);

      fetchHighPriorityTasks(managerId, token)
        .then((data) => setHighPriorityTasks(data || []))
        .catch(console.error);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Overloaded":
        return {
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
        };
      case "Underutilized":
        return {
          backgroundColor: "#fffbeb",
          color: "#d97706",
          border: "1px solid #fed7aa",
        };
      default:
        return {
          backgroundColor: "#ecfdf5",
          color: "#059669",
          border: "1px solid #d1fae5",
        };
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    width: "100%",
    padding: "32px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const headerStyle = {
    marginBottom: "32px",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "600",
    color: "#334155",
    margin: "0 0 8px 0",
  };

  const underlineStyle = {
    width: "64px",
    height: "2px",
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    borderRadius: "1px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  };

  const detailsGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "32px",
    height: "400px",
  };

  const sectionStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    height: "100%",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  };

  const sectionHeaderStyle = (bgColor) => ({
    background: bgColor,
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  const sectionContentStyle = {
    padding: "16px",
    height: "calc(100% - 60px)",
    overflowY: "auto",
  };

  const emptyStateStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "128px",
    color: "#6b7280",
  };

  const taskItemStyle = {
    padding: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    border: "1px solid #f3f4f6",
    borderRadius: "6px",
    marginBottom: "12px",
    transition: "background-color 0.2s ease",
  };

  const memberItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    border: "1px solid #f3f4f6",
    borderRadius: "6px",
    marginBottom: "12px",
    transition: "background-color 0.2s ease",
  };

  const statusChipStyle = (status) => ({
    ...getStatusColor(status),
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  });

  // Responsive styles
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;

  const responsiveContainerStyle = {
    ...containerStyle,
    padding: isMobile ? "16px" : "32px",
  };

  const responsiveDetailsGridStyle = {
    ...detailsGridStyle,
    gridTemplateColumns: isTablet ? "1fr" : "1fr 2fr",
    height: isTablet ? "auto" : "400px",
  };

  const responsiveSectionStyle = {
    ...sectionStyle,
    height: isTablet ? "300px" : "100%",
  };

  return (
    <div style={responsiveContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Manager Dashboard</h1>
        <div style={underlineStyle}></div>
      </div>

      {/* Stat Cards */}
      <div style={gridStyle}>
        <StatCard
          title="My Active Projects"
          value={stats.myProjects}
          icon={<AccountTreeIcon />}
          color="blue"
        />
        <StatCard
          title="My Team Members"
          value={stats.teamMembers}
          icon={<GroupIcon />}
          color="green"
        />
        <StatCard
          title="Open Tasks"
          value={stats.openTasks}
          icon={<PlaylistPlayIcon />}
          color="purple"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon={<AssignmentLateIcon />}
          color="red"
        />
      </div>

      {/* Details Section */}
      <div style={responsiveDetailsGridStyle}>
        {/* High Priority Tasks */}
        <div style={responsiveSectionStyle}>
          <div
            style={sectionHeaderStyle(
              "linear-gradient(90deg, #fef2f2, #fce7f3)"
            )}
          >
            <AssignmentLateIcon sx={{ fontSize: 20, color: "#e11d48" }} />
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#334155",
                margin: 0,
              }}
            >
              High Priority / Overdue Tasks
            </h2>
          </div>

          <div style={sectionContentStyle}>
            {highPriorityTasks.length === 0 ? (
              <div style={emptyStateStyle}>
                <AccessTimeIcon
                  sx={{ fontSize: 32, color: "#f9a8d4", marginBottom: "12px" }}
                />
                <p style={{ textAlign: "center", fontSize: "14px", margin: 0 }}>
                  No high priority tasks found.
                </p>
              </div>
            ) : (
              <div>
                {highPriorityTasks.map((task) => (
                  <div key={task.id} style={taskItemStyle}>
                    <h3
                      style={{
                        fontWeight: "500",
                        color: "#334155",
                        fontSize: "14px",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {task.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      Project: {task.projectTitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team Workload */}
        <div style={responsiveSectionStyle}>
          <div
            style={sectionHeaderStyle(
              "linear-gradient(90deg, #eff6ff, #e0e7ff)"
            )}
          >
            <TrendingUpIcon sx={{ fontSize: 20, color: "#2563eb" }} />
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#334155",
                margin: 0,
              }}
            >
              Team Workload
            </h2>
          </div>

          <div style={sectionContentStyle}>
            {teamWorkload.length === 0 ? (
              <div style={emptyStateStyle}>
                <GroupIcon
                  sx={{ fontSize: 32, color: "#93c5fd", marginBottom: "12px" }}
                />
                <p style={{ textAlign: "center", fontSize: "14px", margin: 0 }}>
                  No team workload data available.
                </p>
              </div>
            ) : (
              <div>
                {teamWorkload.map((member) => (
                  <div key={member.id} style={memberItemStyle}>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontWeight: "500",
                          color: "#334155",
                          fontSize: "14px",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {member.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        {member.totalTask} tasks assigned
                      </p>
                    </div>
                    <span style={statusChipStyle(member.status)}>
                      {member.taskStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
