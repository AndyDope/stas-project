import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Snackbar,
  Chip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminProfilePage = () => {
  const storedUser = JSON.parse(localStorage?.getItem("user") || "{}");
  const token = storedUser?.token;

  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ id: user.id, name: user.name, email: user.email });
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      const response = await fetch("http://localhost:80/api/admin/skills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  useEffect(() => {
    const lowerSearch = newSkill.toLowerCase();
    setFilteredSkills(
      newSkill.trim() === ""
        ? skills
        : skills.filter((skill) =>
            skill.name.toLowerCase().includes(lowerSearch)
          )
    );
  }, [newSkill, skills]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userService.updateMyProfile(profileData);
      updateUser(response.data);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setSnackbar({
        open: true,
        message: "All fields are required.",
        severity: "warning",
      });
      setPasswordLoading(false);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match.",
        severity: "error",
      });
      setPasswordLoading(false);
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      setSnackbar({
        open: true,
        message: "New password must be different.",
        severity: "warning",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      await userService.changePassword(passwordData);
      setSnackbar({
        open: true,
        message: "Password changed successfully!",
        severity: "success",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to change password.",
        severity: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    setAddingSkill(true);
    try {
      const response = await fetch("http://localhost:80/api/admin/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newSkill }),
      });

      if (!response.ok) throw new Error("Failed to add skill");

      setNewSkill("");
      fetchSkills();
      setSnackbar({
        open: true,
        message: "Skill added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.log(error.message);
      setSnackbar({
        open: true,
        message: error.message,
        // || "Failed to add skill.",
        severity: "error",
      });
    } finally {
      setAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const response = await fetch(
        `http://localhost:80/api/admin/skills/${skillId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete skill");

      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      setSnackbar({
        open: true,
        message: "Skill removed successfully!",
        severity: "info",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete skill.",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Profile
      </Typography>
      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box component="form" onSubmit={handleProfileSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Skills Section */}
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              My Skills
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                label="New Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                disabled={addingSkill}
              >
                {addingSkill ? <CircularProgress size={20} /> : "Add"}
              </Button>
            </Box>
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filteredSkills.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  onDelete={() => handleDeleteSkill(skill.id)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordSubmit}>
              {["oldPassword", "newPassword", "confirmPassword"].map(
                (field) => (
                  <TextField
                    key={field}
                    fullWidth
                    margin="normal"
                    label={
                      field === "oldPassword"
                        ? "Current Password"
                        : field === "newPassword"
                        ? "New Password"
                        : "Confirm New Password"
                    }
                    name={field}
                    type={
                      showPasswords[field.replace("Password", "")]
                        ? "text"
                        : "password"
                    }
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              togglePasswordVisibility(
                                field.replace("Password", "")
                              )
                            }
                            edge="end"
                          >
                            {showPasswords[field.replace("Password", "")] ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Change Password"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfilePage;
