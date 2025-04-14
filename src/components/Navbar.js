import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [restaurantMenuAnchor, setRestaurantMenuAnchor] = useState(null);

  const isRestaurant = localStorage.getItem('restaurant');

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleRestaurantMenu = (event) => {
    setRestaurantMenuAnchor(event.currentTarget);
  };

  const handleCloseMenus = () => {
    setUserMenuAnchor(null);
    setRestaurantMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenus();
    navigate('/');
  };

  const handleRestaurantLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('restaurant');
    handleCloseMenus();
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}
        >
          FlavorFleet
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!user && !isRestaurant && (
            <Tooltip title="Restaurant Options">
              <IconButton
                color="inherit"
                onClick={handleRestaurantMenu}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <RestaurantIcon />
              </IconButton>
            </Tooltip>
          )}

          {isRestaurant && (
            <Tooltip title="Restaurant Dashboard">
              <IconButton
                color="inherit"
                component={Link}
                to="/restaurant/dashboard"
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <DashboardIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Show cart icon for both logged-in and non-logged-in users */}
          {!isRestaurant && (
            <Tooltip title="Cart">
              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Badge badgeContent={cart?.length || 0} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {user && (
            <Tooltip title="User Menu">
              <IconButton
                color="inherit"
                onClick={handleUserMenu}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          )}

          {!user && !isRestaurant && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                startIcon={<RegisterIcon />}
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}

          {/* Restaurant Menu */}
          <Menu
            anchorEl={restaurantMenuAnchor}
            open={Boolean(restaurantMenuAnchor)}
            onClose={handleCloseMenus}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)',
              },
            }}
          >
            <MenuItem 
              component={Link} 
              to="/restaurant/login"
              onClick={handleCloseMenus}
            >
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Restaurant Login</ListItemText>
            </MenuItem>
            <MenuItem 
              component={Link} 
              to="/restaurant/register"
              onClick={handleCloseMenus}
            >
              <ListItemIcon>
                <RegisterIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Register Restaurant</ListItemText>
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleCloseMenus}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)',
              },
            }}
          >
            <MenuItem component={Link} to="/cart" onClick={handleCloseMenus}>
              <ListItemIcon>
                <CartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cart</ListItemText>
              <Badge badgeContent={cart?.length || 0} color="secondary" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 