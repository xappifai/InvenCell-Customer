import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, Hidden } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import InvenCellLogo from "../Assets/logo.png";
import InvenCellLogoColored from "../Assets/logo-color.png"
import "../Styles/style.css";
import LogoutIcon from "@mui/icons-material/LogoutOutlined"

const NavBar = () => {


  const navigate=useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:960px)');

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  const handleLogout=(event)=>{
    event.preventDefault()
    localStorage.removeItem("token")
    console.log('log-out success')
    navigate('/', { replace: true });
  }

  

  
  

  
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isSmallScreen && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/home" className="nav-link">
            <img src={InvenCellLogo} alt="InvenCell" className="logo" height={'80px'} />
          </Link>
        </Typography>
        <Hidden smDown>
          <div className="nav-links">
            <Button color="inherit" component={Link} to="/home">Home</Button>
            <Button color="inherit" component={Link} to="/available">Available Stock</Button>
            <Button color="inherit" component={Link} to="/sold">Sold Stock</Button>
            <Button color="inherit" component={Link} to="/add">Add Stock</Button>
            <Button color="inherit" component={Link} to="/expense">Manage Expense</Button>
            <IconButton color="inherit" component={Link} onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </Hidden>
      </Toolbar>

      {/* Drawer for small screens */}
      <Hidden mdUp>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            <ListItem button onClick={toggleDrawer(false)}>
              <ListItemText>
                <Link to="/home" className="nav-link">
                  <img src={InvenCellLogoColored} alt="InvenCell" className="logo"  height={'100px'}/>
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/home">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/available">
              <ListItemText primary="Available Stock" />
            </ListItem>
            <ListItem button component={Link} to="/sold">
              <ListItemText primary="Sold Stock" />
            </ListItem>
            <ListItem button component={Link} to="/add">
              <ListItemText primary="Add Stock" />
            </ListItem>
            <ListItem button component={Link} to="/">
            <LogoutIcon style={{ color: 'red' }} />
              <ListItemText primary="Logout" style={{color:'red'}}/>
            </ListItem>
          </List>
        </Drawer>
      </Hidden>
    </AppBar>
  );
}

export default NavBar;
