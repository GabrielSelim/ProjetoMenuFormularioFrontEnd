import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Collapse,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard,
  Description,
  Settings,
  People,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Folder,
  InsertDriveFile,
  Link as LinkIcon,
  Build
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

// Ícones para diferentes tipos de menu
const getMenuIcon = (iconName, type) => {
  const iconMap = {
    dashboard: <Dashboard />,
    description: <Description />,
    settings: <Settings />,
    people: <People />,
    menu: <MenuIcon />,
    folder: <Folder />,
    file: <InsertDriveFile />,
    link: <LinkIcon />,
    build: <Build />,
  };

  return iconMap[iconName?.toLowerCase()] || iconMap[type?.toLowerCase()] || <InsertDriveFile />;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menus, loading, error } = useMenu();
  const { hasRole } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleMenuClick = (menu) => {
    if (menu.children && menu.children.length > 0) {
      // Menu com submenu - expande/colapsa
      setExpandedMenus(prev => ({
        ...prev,
        [menu.id]: !prev[menu.id]
      }));
    } else {
      // Menu sem submenu - navega
      handleNavigation(menu);
    }
  };

  const handleNavigation = (menu) => {
    const menuType = menu.contentType?.toLowerCase();
    switch (menuType) {
      case 'route':
      case 'page':
        navigate(menu.urlOrPath || '/');
        break;
      case 'form':
        navigate(`/forms/${menu.urlOrPath}`);
        break;
      case 'iframe':
        navigate(`/iframe/${menu.id}`);
        break;
      case 'external':
      case 'link':
        window.open(menu.urlOrPath, '_blank');
        break;
      default:
        if (menu.urlOrPath) {
          navigate(menu.urlOrPath);
        }
    }
  };

  const isMenuActive = (menu) => {
    if (menu.urlOrPath) {
      return location.pathname === menu.urlOrPath;
    }
    if (menu.contentType === 'form' && menu.urlOrPath) {
      return location.pathname === `/forms/${menu.urlOrPath}`;
    }
    return false;
  };

  const renderMenuItem = (menu, level = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedMenus[menu.id];
    const isActive = isMenuActive(menu);

    return (
      <React.Fragment key={menu.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMenuClick(menu)}
            selected={isActive}
            sx={{
              pl: 2 + (level * 2),
              minHeight: 48,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getMenuIcon(menu.icon, menu.type)}
            </ListItemIcon>
            <ListItemText 
              primary={menu.name}
              primaryTypographyProps={{
                fontSize: level > 0 ? '0.875rem' : '1rem',
                fontWeight: isActive ? 600 : 400
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menu.children.map(childMenu => 
                renderMenuItem(childMenu, level + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // Organiza os menus em hierarquia (pais e filhos)
  const organizeMenus = (menuList) => {
    const menuMap = {};
    const rootMenus = [];

    // Cria um mapa de todos os menus
    menuList.forEach(menu => {
      menuMap[menu.id] = { ...menu, children: [] };
    });

    // Organiza em hierarquia
    menuList.forEach(menu => {
      if (menu.parentId && menuMap[menu.parentId]) {
        menuMap[menu.parentId].children.push(menuMap[menu.id]);
      } else {
        rootMenus.push(menuMap[menu.id]);
      }
    });

    // Ordena por ordem
    const sortByOrder = (a, b) => (a.order || 0) - (b.order || 0);
    rootMenus.sort(sortByOrder);
    rootMenus.forEach(menu => {
      if (menu.children.length > 0) {
        menu.children.sort(sortByOrder);
      }
    });

    return rootMenus;
  };

  const organizedMenus = organizeMenus(menus);

  // Menu padrão sempre visível
  const defaultMenus = [
    { id: 'dashboard', name: 'Dashboard', urlOrPath: '/dashboard', contentType: 'route', icon: 'dashboard', order: 0 },
    { id: 'admin-section', name: 'ADMINISTRAÇÃO', contentType: 'section', order: 1 },
    { id: 'admin-menus', name: 'Gerenciar Menus', urlOrPath: '/admin/menus', contentType: 'route', icon: 'settings', order: 2 },
    { id: 'form-builder', name: 'Construtor de Formulários', urlOrPath: '/admin/forms/builder', contentType: 'route', icon: 'build', order: 3 },
    { id: 'form-list', name: 'Lista de Formulários', urlOrPath: '/forms', contentType: 'route', icon: 'description', order: 4 }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', py: 1 }}>
        <List>
          {/* Menus padrão sempre visíveis */}
          {defaultMenus.map(menu => 
            menu.contentType === 'section' ? (
              <ListItem key={menu.id}>
                <Typography variant="overline" color="text.secondary" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                  {menu.name}
                </Typography>
              </ListItem>
            ) : renderMenuItem(menu)
          )}
          
          {/* Menus dinâmicos da API */}
          {!loading && !error && organizedMenus.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              {organizedMenus.map(menu => renderMenuItem(menu))}
            </>
          )}
          
          {loading && (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          {error && (
            <Box p={2}>
              <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.75rem' }}>
                Menus em modo offline
              </Alert>
            </Box>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;