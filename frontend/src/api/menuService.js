import api from './axiosConfig';

export const menuService = {
  // Busca todos os menus
  getMenus: async () => {
    try {
      console.log('🔍 Buscando todos os menus...');
      const response = await api.get('/Menus');
      const menus = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Menus encontrados:', menus.length);
      return menus;
    } catch (error) {
      console.error('❌ Erro ao buscar menus:', error);
      // Retorna array vazio em vez de throw para evitar crashes
      return [];
    }
  },

  // Busca menus filtrados por role do usuário (filtrado no frontend)
  getMenusByRole: async (role) => {
    try {
      console.log('🔍 Buscando menus para role:', role);
      const response = await api.get('/Menus');
      const allMenus = Array.isArray(response.data) ? response.data : [];
      
      // Filtra menus baseado no role do usuário
      const filteredMenus = allMenus.filter(menu => {
        if (!menu.rolesAllowed) return true; // Se não tem restrição, mostra para todos
        const allowedRoles = menu.rolesAllowed.split(',').map(r => r.trim().toLowerCase());
        return allowedRoles.includes(role.toLowerCase()) || allowedRoles.includes('all');
      });
      
      console.log('✅ Menus filtrados:', filteredMenus.length);
      return filteredMenus;
    } catch (error) {
      console.error('❌ Erro ao buscar menus por role:', error);
      // Retorna array vazio em vez de throw para evitar crashes
      return [];
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
      console.log('🔄 Reordenando menus:', reorderedMenus.map(m => ({ id: m.id, name: m.name, newOrder: reorderedMenus.indexOf(m) + 1 })));
      
      const updatePromises = reorderedMenus.map((menu, index) => {
        // Envia apenas os campos necessários para a API
        const updateData = {
          name: menu.name,
          contentType: menu.contentType,
          urlOrPath: menu.urlOrPath,
          rolesAllowed: menu.rolesAllowed,
          order: index + 1,
          icon: menu.icon,
          parentId: menu.parentId
        };
        
        console.log(`📝 Atualizando menu ${menu.id} com ordem ${index + 1}`);
        return api.put(`/Menus/${menu.id}`, updateData);
      });
      
      await Promise.all(updatePromises);
      console.log('✅ Reordenação concluída com sucesso');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao reordenar menus:', error);
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