import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import baseurl from "../Assets/baseurl";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setFeedback("Passwords do not match");
        setOpenDialog(true);
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.post(`${baseurl}:5629/api/forgot`, {
          email,
          oldPassword,
          newPassword,
        });
        setLoading(false);
        setFeedback(response.data);
        setOpenDialog(true);
      } catch (error) {
        setLoading(false);
        setFeedback("An error occurred. Please try again later.");
        setOpenDialog(true);
        console.error("Error:");
      }
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    return (
      <Container component="main" maxWidth="xs">
        <div >
          <Avatar >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </Button>
          </form>
        </div>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>Password</DialogTitle>
  <DialogContent>
    <Typography variant="h6" style={{ fontWeight: 'bold', color: 'black' }}>
      <span style={{ color: 'green', marginRight: '8px' }}>&#10003;</span>
      {feedback}
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

      </Container>
    );
  };
  
  export default ForgotPassword;
  