import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import BackgroundImage from "../Assets/wallpaper.jpg"; // Import your logo image
import baseurl from '../Assets/baseurl';

function SignInSide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Initialize with 'error'
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false); // State to disable submit button
  const submitDelay = 3000; // 3 seconds delay

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    navigate('/forgot-password');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setDisableSubmit(true); // Disable submit button
    try {
      const response = await axios.post(`${baseurl}/api/signin`, formData);
      
      if (response.status === 200) {
        setTimeout(() => {
          localStorage.setItem('token', response.data.token);
          navigate('/home');
        }, submitDelay);
      } 
      else if (response.status === 403 || response.status === 401) {
        // Handle different status codes
        setSnackbarSeverity('error');
        setSnackbarMessage(response.data); // Set the message from backend response
        
        

        setSnackbarOpen(true);
      }
    } 
    catch(error){ 
      if (error.response.status === 403 || error.response.status === 401) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response.data); // Set the message from backend response
      setSnackbarOpen(true);
    }}
    finally {
      setLoading(false);
      setTimeout(() => {
        setDisableSubmit(false); // Enable submit button after delay
      }, submitDelay);
    }
  };
  
  const defaultTheme = createTheme();

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={disableSubmit || loading} // Disable the button when loading or disabled
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button onClick={handleForgotPassword} variant="body2">
                    Forgot password?
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default SignInSide;
