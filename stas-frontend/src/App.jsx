import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts and Protectors
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import DashboardRedirect from "./components/auth/DashboardRedirect";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import DeveloperDashboardPage from "./pages/DeveloperDashboardPage";
import ManagerProjectsPage from "./pages/ManagerProjectsPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import DeveloperTasksPage from "./pages/DeveloperTasksPage";
import MyProfilePage from "./pages/MyProfilePage";
import ManagerFeedbackPage from "./pages/ManagerFeedbackPage"; // adjust the path as needed
import ManagerReceivedFeedbackPage from "./pages/ManagerReceivedFeedbackPage"; // adjust path if needed
import ManagerAssignTaskPage from "./pages/ManagerAssignTaskPage"; // adjust path if needed
import ManagerEditTaskPage from "./pages/ManagerEditTaskPage"; // adjust path if needed
import ManagerProjectDetails from "./pages/ManagerProjectDetails";
import ManagerAllTasksPage from "./pages/ManagerAllTasksPage";

import { useParams } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* THIS IS THE FIX: Use the dynamic redirect component */}
              <Route index element={<DashboardRedirect />} />

              <Route path="profile" element={<MyProfilePage />} />

              <Route element={<RoleBasedRoute allowedRoles={["ADMIN"]} />}>
                <Route
                  path="admin/dashboard"
                  element={<AdminDashboardPage />}
                />
                <Route path="admin/users" element={<UserManagementPage />} />
              </Route>

              {/* { text: "My Feedback", icon: <SettingsIcon />, path: "/myfeedback" }, */}
              <Route element={<RoleBasedRoute allowedRoles={["MANAGER"]} />}>
                <Route
                  path="manager/dashboard"
                  element={<ManagerDashboardPage />}
                />
                <Route
                  path="manager/projects"
                  element={<ManagerProjectsPage />}
                />
                <Route
                  path="/manager/projects/:projectId"
                  element={<ManagerProjectDetails />}
                />
                <Route
                  path="/manager/feedback"
                  element={<ManagerFeedbackPage />}
                />
                <Route
                  path="/manager/all-tasks"
                  element={<ManagerAllTasksPage />}
                />

                <Route
                  path="/manager/assigntask"
                  element={<ManagerAssignTaskPage />}
                />
                <Route
                  path="/manager/edit-task"
                  element={<ManagerEditTaskPage />}
                />

                <Route
                  path="/manager/received-feedbacks"
                  element={<ManagerReceivedFeedbackPage />}
                />
              </Route>
              <Route element={<RoleBasedRoute allowedRoles={["CLIENT"]} />}>
                <Route
                  path="client/dashboard"
                  element={<ClientDashboardPage />}
                />
                <Route path="client/projects" element={<MyProjectsPage />} />
                <Route
                  path="client/create-project"
                  element={<CreateProjectPage />}
                />
              </Route>
              <Route element={<RoleBasedRoute allowedRoles={["DEVELOPER"]} />}>
                <Route
                  path="developer/dashboard"
                  element={<DeveloperDashboardPage />}
                />
                <Route
                  path="developer/tasks"
                  element={<DeveloperTasksPage />}
                />
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
