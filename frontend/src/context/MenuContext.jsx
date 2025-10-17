import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuService } from '../api/menuService';
import { useAuth } from './AuthContext';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu deve ser usado dentro de um MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadMenus = async () => {
    if (!user || !user.role) {
      setMenus([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const menusData = await menuService.getMenusByRole(user.role);
      
      if (Array.isArray(menusData)) {
        setMenus(menusData);
      } else {
        setMenus([]);
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao carregar menus';
      setError(errorMessage);
      
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  // Carrega todos os menus (para admin)
  const loadAllMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const menusData = await menuService.getMenus();
      
      if (Array.isArray(menusData)) {
        setMenus(menusData);
      } else {
        setMenus([]);
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao carregar menus';
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // Cria um novo menu
  const createMenu = async (menuData) => {
    try {
      const newMenu = await menuService.createMenu(menuData);
      setMenus(prev => [...prev, newMenu]);
      return newMenu;
    } catch (err) {
      throw err;
    }
  };

  // Atualiza um menu existente
  const updateMenu = async (id, menuData) => {
    try {
      const updatedMenu = await menuService.updateMenu(id, menuData);
      setMenus(prev => 
        prev.map(menu => menu.id === id ? updatedMenu : menu)
      );
      return updatedMenu;
    } catch (err) {
      throw err;
    }
  };

  // Deleta um menu
  const deleteMenu = async (id) => {
    try {
      await menuService.deleteMenu(id);
      setMenus(prev => prev.filter(menu => menu.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Reordena os menus
  const reorderMenus = async (reorderedMenus) => {
    try {
      
      setMenus(reorderedMenus);
      
      await menuService.reorderMenus(reorderedMenus);
      
    } catch (err) {
      throw err;
    }
  };

  // Filtra menus por tipo
  const getMenusByType = (type) => {
    return menus.filter(menu => menu.type === type);
  };

  // Busca menu por ID
  const getMenuById = (id) => {
    return menus.find(menu => menu.id === id);
  };

  // Recarrega menus quando o usuário muda
  useEffect(() => {
    if (user) {
      loadMenus();
    } else {
      setMenus([]);
      setError(null); // Limpa qualquer erro anterior
    }
  }, [user]);

  const value = {
    menus,
    loading,
    error,
    loadMenus,
    loadAllMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    reorderMenus,
    getMenusByType,
    getMenuById
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
