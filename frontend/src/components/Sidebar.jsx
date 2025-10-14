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
  Build,
  Assignment
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

// Ícones para diferentes tipos de menu com emojis
const getMenuIcon = (iconName, type) => {
  const emojiIcons = {
    dashboard: '📊',
    description: '📝',
    settings: '⚙️',
    people: '👥',
    menu: '📋',
    folder: '📁',
    file: '📄',
    link: '🔗',
    build: '🔧',
    contact_mail: '📧',
    assignment: '📋',
    feedback: '💬',
    quiz: '❓',
    home: '🏠',
    info: 'ℹ️',
    help: '❓'
  };

  const materialIcons = {
    dashboard: <Dashboard />,
    description: <Description />,
    settings: <Settings />,
    people: <People />,
    menu: <MenuIcon />,
    folder: <Folder />,
    file: <InsertDriveFile />,
    link: <LinkIcon />,
    build: <Build />,
    assignment: <Assignment />,
  };

  // Prioriza emoji se disponível, senão usa Material UI
  const emoji = emojiIcons[iconName?.toLowerCase()];
  if (emoji) {
    return <span style={{ fontSize: '20px' }}>{emoji}</span>;
  }

  return materialIcons[iconName?.toLowerCase()] || materialIcons[type?.toLowerCase()] || <InsertDriveFile />;
};

const Sidebar = ({ mobileOpen, onMobileClose }) => {
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
      case 'formulario':
        // Para menus do tipo formulário, navega diretamente para /forms/{formId}
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
    
    // Fechar menu mobile após navegação
    if (onMobileClose) {
      onMobileClose();
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

  // Menu padrão - filtra baseado no role do usuário
  const getDefaultMenus = () => {
    const allMenus = [
      { id: 'dashboard', name: 'Dashboard', urlOrPath: '/dashboard', contentType: 'route', icon: 'dashboard', order: 0 },
      { id: 'submissions', name: 'Minhas Submissões', urlOrPath: '/submissions', contentType: 'route', icon: 'assignment', order: 1 },
      { id: 'admin-section', name: 'ADMINISTRAÇÃO', contentType: 'section', order: 2, requiresRole: ['admin', 'manager'] },
      { id: 'admin-menus', name: 'Gerenciar Menus', urlOrPath: '/admin/menus', contentType: 'route', icon: 'settings', order: 3, requiresRole: ['admin', 'manager'] },
      { id: 'form-list', name: 'Lista de Formulários', urlOrPath: '/forms', contentType: 'route', icon: 'description', order: 4, requiresRole: ['admin', 'manager'] }
    ];

    // Filtra menus baseado no role do usuário
    return allMenus.filter(menu => {
      if (!menu.requiresRole) return true; // Menu público
      return hasRole(menu.requiresRole); // Verifica se o usuário tem o role necessário
    });
  };

  const defaultMenus = getDefaultMenus();

  const drawer = (
    <>
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
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;