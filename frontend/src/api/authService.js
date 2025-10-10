import api from './axiosConfig';

export const authService = {
  // Login do usuário
  login: async (email, password) => {
    try {
      const response = await api.post('/Auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer login' };
    }
  },

  // Logout do usuário
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verifica se o usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Pega o usuário atual do localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Registra um novo usuário (se necessário)
  register: async (userData) => {
    try {
      const response = await api.post('/Auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao registrar usuário' };
    }
  },

  // Atualiza o perfil do usuário
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar perfil' };
    }
  }
};