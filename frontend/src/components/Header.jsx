import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Header = ({ onMenuToggle, showMenuButton = false }) => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Toolbar>
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            onClick={onMenuToggle}
            edge="start"
            sx={{ 
              mr: 2,
              display: { md: 'none' }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Sistema de Formulários Sanz Tech
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Olá, {user.name}
          </Typography>
          <IconButton
            size="large"
            aria-label="conta do usuário"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Perfil</MenuItem>
            <MenuItem onClick={handleClose}>Configurações</MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;