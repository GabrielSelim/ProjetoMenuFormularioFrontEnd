import api from './axiosConfig';

export const menuService = {
  // Busca todos os menus
  getMenus: async () => {
    try {
      const response = await api.get('/Menus');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar menus' };
    }
  },

  // Busca menus filtrados por role do usuário (filtrado no frontend)
  getMenusByRole: async (role) => {
    try {
      const response = await api.get('/Menus');
      const allMenus = response.data;
      
      // Filtra menus baseado no role do usuário
      const filteredMenus = allMenus.filter(menu => {
        if (!menu.rolesAllowed) return true; // Se não tem restrição, mostra para todos
        const allowedRoles = menu.rolesAllowed.split(',').map(r => r.trim().toLowerCase());
        return allowedRoles.includes(role.toLowerCase()) || allowedRoles.includes('all');
      });
      
      return filteredMenus;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar menus por role' };
    }
  },

  // Cria um novo menu
  createMenu: async (menuData) => {
    try {
      const response = await api.post('/Menus', menuData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar menu' };
    }
  },

  // Atualiza um menu existente
  updateMenu: async (id, menuData) => {
    try {
      const response = await api.put(`/Menus/${id}`, menuData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar menu' };
    }
  },

  // Deleta um menu
  deleteMenu: async (id) => {
    try {
      const response = await api.delete(`/Menus/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao deletar menu' };
    }
  },

  // Reordena os menus (atualiza a ordem de cada menu individualmente)
  reorderMenus: async (reorderedMenus) => {
    try {
      const updatePromises = reorderedMenus.map((menu, index) => {
        const updatedMenu = { ...menu, order: index + 1 };
        return api.put(`/Menus/${menu.id}`, updatedMenu);
      });
      
      await Promise.all(updatePromises);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao reordenar menus' };
    }
  },

  // Busca um menu específico por ID
  getMenuById: async (id) => {
    try {
      const response = await api.get(`/Menus/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar menu' };
    }
  }
};