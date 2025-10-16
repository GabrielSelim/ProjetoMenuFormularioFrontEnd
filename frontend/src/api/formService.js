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

      const response = await api.post('/Forms', formData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar formulário:', error.response?.data || error.message);
      if (error.response?.status === 400) {
        throw { message: 'Dados inválidos. Verifique se todos os campos obrigatórios estão preenchidos.' };
      }
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw { message: 'API não está disponível. Verifique a conexão com https://formsmenuapi.gabrielsanztech.com.br' };
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

  // Busca todas as versões de um formulário
  getFormVersions: async (originalFormId) => {
    try {
      const response = await api.get(`/Forms/${originalFormId}/versions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar versões do formulário' };
    }
  },

  // Busca a versão mais recente de um formulário
  getLatestVersion: async (originalFormId) => {
    try {
      const response = await api.get(`/Forms/${originalFormId}/latest`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar versão mais recente' };
    }
  },

  // Busca uma versão específica de um formulário
  getFormByVersion: async (originalFormId, version) => {
    try {
      const response = await api.get(`/Forms/${originalFormId}/version/${version}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar versão específica' };
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

  // Submete dados de um formulário (cria submissão)
  submitForm: async (formId, formData) => {
    try {
      const response = await api.post(`/SubmissoesFormulario`, {
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
      const response = await api.get(`/SubmissoesFormulario`, {
        params: { formId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar submissions' };
    }
  },

  // Busca submissions do usuário atual
  getMySubmissions: async () => {
    try {
      const response = await api.get('/SubmissoesFormulario');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar minhas submissions' };
    }
  }
};