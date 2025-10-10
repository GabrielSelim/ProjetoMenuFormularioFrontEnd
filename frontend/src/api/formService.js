import api from './axiosConfig';

export const formService = {
  // Busca todos os formulários
  getForms: async () => {
    try {
      const response = await api.get('/Forms');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      throw error.response?.data || { message: 'Erro ao buscar formulários' };
    }
  },

  // Busca um formulário específico por ID
  getFormById: async (id) => {
    try {
      const response = await api.get(`/Forms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar formulário:', error);
      throw error.response?.data || { message: 'Erro ao buscar formulário' };
    }
  },

  // Cria um novo formulário
  createForm: async (formData) => {
    try {
      console.log('Enviando dados do formulário:', formData);
      const response = await api.post('/Forms', formData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar formulário:', error.response?.data || error.message);
      if (error.response?.status === 400) {
        throw { message: 'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos.' };
      }
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw { message: 'API não está disponível. Verifique se o servidor backend está rodando em http://localhost:5000' };
      }
      throw error.response?.data || { message: 'Erro ao criar formulário' };
    }
  },

  // Atualiza um formulário existente
  updateForm: async (id, formData) => {
    try {
      const response = await api.put(`/Forms/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar formulário' };
    }
  },

  // Deleta um formulário
  deleteForm: async (id) => {
    try {
      const response = await api.delete(`/Forms/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao deletar formulário' };
    }
  },

  // Submete dados de um formulário
  submitForm: async (formId, formData) => {
    try {
      const response = await api.post(`/Submissions`, {
        formId,
        dataJson: JSON.stringify(formData)
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      throw error.response?.data || { message: 'Erro ao submeter formulário' };
    }
  },

  // Busca submissions de um formulário
  getFormSubmissions: async (formId) => {
    try {
      const response = await api.get(`/Submissions/form/${formId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar submissions' };
    }
  },

  // Busca submissions do usuário atual
  getMySubmissions: async () => {
    try {
      const response = await api.get('/Submissions/my-submissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar minhas submissions' };
    }
  }
};