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
  Chip,
  Stack,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MenuItem } from "@mui/material";

const DeveloperProfilePage = () => {
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Skills state
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillsLoading, setSkillsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ id: user.id, name: user.name, email: user.email });
      fetchSkills();
      fetchAvailableSkills();
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await userService.updateMyProfile(profileData);
      updateUser(response.data);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

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
      setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 3000);
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

  // Fetch user's current skills
  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);
      const res = await fetch(
        `http://localhost:80/developer/${user.id}/skills`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSkills(data);
      console.log("Fetched skills:", data); // Debugging line to check fetched skills
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Fetch all available skills
  const fetchAvailableSkills = async () => {
    try {
      const res = await fetch(`http://localhost:80/developer/allSkills`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAvailableSkills(data);
      console.log("Fetched available skills:", data); // Debugging line to check available skills
    } catch (err) {
      console.error("Failed to fetch available skills:", err);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:80/developer/${user.id}/addSkills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ skill: newSkill }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to add skill");
      }
      setNewSkill("");
      await fetchSkills(); // Refresh the list
      setSnackbar({
        open: true,
        message: "Skill added successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add skill.",
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
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordSubmit}>
              {["oldPassword", "newPassword", "confirmPassword"].map(
                (field, i) => (
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

      {/* Skills Section */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={10} lg={8}>
          <Paper
            sx={{
              p: 5,
              backgroundColor: "#f5f5f5",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" gutterBottom>
              My Skills
            </Typography>

            {skillsLoading ? (
              <CircularProgress />
            ) : (
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={1.5}
                sx={{ mb: 3 }}
              >
                {skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    sx={{ fontSize: "1rem", height: 40 }}
                  />
                ))}
              </Stack>
            )}

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={9}>
                <TextField
                  select
                  fullWidth
                  label="Select Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  sx={{
                    fontSize: "1rem",
                    ".MuiInputBase-root": {
                      height: "56px",
                      width: 200, // optional: to make it taller
                    },
                    ".MuiSelect-select": {
                      fontSize: "1rem",
                    },
                  }}
                >
                  {availableSkills
                    .filter((skill) => !skills.includes(skill))
                    .map((skill, index) => (
                      <MenuItem key={index} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!newSkill}
                  fullWidth
                  sx={{ height: "100%", py: 1.5, fontSize: "1rem" }}
                >
                  Add Skill
                </Button>
              </Grid>
            </Grid>
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

export default DeveloperProfilePage;
