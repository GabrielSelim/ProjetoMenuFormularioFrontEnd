import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header 
        onMenuToggle={handleDrawerToggle} 
        showMenuButton={true}
      />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onMobileClose={handleMobileClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;