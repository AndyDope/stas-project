import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';
// Add other page imports as needed

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes are only accessible when not logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Add AdminLoginPage here if it exists */}
            <Route path='/admin/login' element={<AdminLoginPage />} />
          </Route>
          
          {/* Protected routes are only accessible when logged in and use the main layout */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Default redirect after login */}
              <Route index element={<Navigate to="/manager/dashboard" replace />} />

              {/* Manager Routes */}
              <Route path="manager/dashboard" element={<ManagerDashboardPage />} />
              <Route path="manager/projects" element={<ProjectListPage />} />
              <Route path="manager/projects/:projectId" element={<ProjectDetailPage />} />
              
              {/* Client Routes */}
              <Route path="client/dashboard" element={<ClientDashboardPage />} />
              <Route path="client/projects" element={<ProjectListPage />} />
              <Route path="client/create-project" element={<CreateProjectPage />} />

              {/* Add other role routes here */}
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;