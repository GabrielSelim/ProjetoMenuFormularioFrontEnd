import api from './axiosConfig';

export const submissionService = {
  // ============= CRUD BÁSICO =============
  
  // Criar nova submissão
  create: async (data) => {
    try {
      const response = await api.post('/SubmissoesFormulario', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar submissão' };
    }
  },

  // Listar submissões com filtros e paginação
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/SubmissoesFormulario', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar submissões:', error);
      throw error.response?.data || { message: 'Erro ao buscar submissões' };
    }
  },

  // Buscar submissão específica por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/SubmissoesFormulario/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar submissão:', error);
      throw error.response?.data || { message: 'Erro ao buscar submissão' };
    }
  },

  // Atualizar submissão existente
  update: async (id, data) => {
    try {
      const response = await api.put(`/SubmissoesFormulario/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar submissão:', error);
      throw error.response?.data || { message: 'Erro ao atualizar submissão' };
    }
  },

  // Excluir submissão (soft delete)
  delete: async (id, motivo = '') => {
    try {
      const response = await api.delete(`/SubmissoesFormulario/${id}`, {
        data: motivo,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir submissão:', error);
      throw error.response?.data || { message: 'Erro ao excluir submissão' };
    }
  },

  // ============= WORKFLOW ACTIONS =============

  // Enviar submissão para análise
  enviar: async (id, comentario = '') => {
    try {
      const response = await api.post(`/SubmissoesFormulario/${id}/enviar`, comentario, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.errors && apiError.errors.$) {
          throw new Error(apiError.errors.$[0]);
        }
        if (apiError.title) {
          throw new Error(apiError.title);
        }
        if (apiError.message) {
          throw new Error(apiError.message);
        }
      }
      throw new Error('Erro ao enviar submissão');
    }
  },

  // Mudar status da submissão (função genérica)
  mudarStatus: async (id, { novoStatus, comentario = '', motivoRejeicao = null, versao }) => {
    try {
      const payload = {
        novoStatus,
        comentario,
        versao
      };
      
      if (motivoRejeicao) {
        payload.motivoRejeicao = motivoRejeicao;
      }
      
      const response = await api.put(`/SubmissoesFormulario/${id}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao mudar status:', error);
      throw error.response?.data || { message: 'Erro ao mudar status' };
    }
  },



  // Aprovar submissão (Admin/Gestor)
  aprovar: async (id, comentario = '') => {
    try {
      const response = await api.post(`/SubmissoesFormulario/${id}/aprovar`, comentario, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar submissão:', error);
      throw error.response?.data || { message: 'Erro ao aprovar submissão' };
    }
  },

  // Rejeitar submissão (Admin/Gestor)
  rejeitar: async (id, { comentario = '', motivoRejeicao }) => {
    try {
      if (!motivoRejeicao) {
        throw new Error('Motivo da rejeição é obrigatório');
      }
      const payload = {
        comentario,
        motivoRejeicao
      };
      const response = await api.post(`/SubmissoesFormulario/${id}/rejeitar`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao rejeitar submissão:', error);
      throw error.response?.data || { message: 'Erro ao rejeitar submissão' };
    }
  },

  // Cancelar submissão
  cancelar: async (id, comentario = '') => {
    try {
      const response = await api.post(`/SubmissoesFormulario/${id}/cancelar`, comentario, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar submissão:', error);
      throw error.response?.data || { message: 'Erro ao cancelar submissão' };
    }
  },

  // ============= CONSULTAS ESPECIAIS =============

  // Buscar histórico da submissão
  getHistory: async (id) => {
    try {
      const response = await api.get(`/SubmissoesFormulario/${id}/historico`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error.response?.data || { message: 'Erro ao buscar histórico' };
    }
  },

  // Buscar estatísticas (Admin/Gestor)
  getEstatisticas: async (params = {}) => {
    try {
      const response = await api.get('/SubmissoesFormulario/estatisticas', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error.response?.data || { message: 'Erro ao buscar estatísticas' };
    }
  }
};

// ============= ENUMS E CONSTANTES =============

export const StatusSubmissao = {
  Rascunho: 0,
  Enviado: 1,
  EmAnalise: 2,
  Aprovado: 3,
  Rejeitado: 4,
  Cancelado: 5
};

export const StatusSubmissaoLabels = {
  [StatusSubmissao.Rascunho]: 'Rascunho',
  [StatusSubmissao.Enviado]: 'Enviado',
  [StatusSubmissao.EmAnalise]: 'Em Análise',
  [StatusSubmissao.Aprovado]: 'Aprovado',
  [StatusSubmissao.Rejeitado]: 'Rejeitado',
  [StatusSubmissao.Cancelado]: 'Cancelado'
};

export const StatusSubmissaoColors = {
  [StatusSubmissao.Rascunho]: 'default',
  [StatusSubmissao.Enviado]: 'primary',
  [StatusSubmissao.EmAnalise]: 'warning',  
  [StatusSubmissao.Aprovado]: 'success',
  [StatusSubmissao.Rejeitado]: 'error',
  [StatusSubmissao.Cancelado]: 'default'
};

export const AcaoSubmissao = {
  Criacao: 0,
  Atualizacao: 1,
  Envio: 2,
  ColocarAnalise: 3,
  Aprovacao: 4,
  Rejeicao: 5,
  Cancelamento: 6
};

export const AcaoSubmissaoLabels = {
  [AcaoSubmissao.Criacao]: 'Criação',
  [AcaoSubmissao.Atualizacao]: 'Atualização',
  [AcaoSubmissao.Envio]: 'Envio',
  [AcaoSubmissao.ColocarAnalise]: 'Colocado em Análise',
  [AcaoSubmissao.Aprovacao]: 'Aprovação',
  [AcaoSubmissao.Rejeicao]: 'Rejeição',
  [AcaoSubmissao.Cancelamento]: 'Cancelamento'
};

// ============= HELPERS =============

export const getStatusLabel = (status) => {
  return StatusSubmissaoLabels[status] || 'Desconhecido';
};

export const getStatusColor = (status) => {
  return StatusSubmissaoColors[status] || 'default';
};

export const getAcaoLabel = (acao) => {
  return AcaoSubmissaoLabels[acao] || 'Desconhecido';
};

export const canEdit = (submission, userRole) => {
  // Proprietário pode editar apenas rascunhos
  if (submission.status === StatusSubmissao.Rascunho) {
    return true;
  }
  
  // Admin pode editar qualquer coisa exceto aprovados
  if (userRole === 'admin' && submission.status !== StatusSubmissao.Aprovado) {
    return true;
  }
  
  return false;
};

export const canDelete = (submission, userRole) => {
  // Proprietário pode excluir apenas rascunhos
  if (submission.status === StatusSubmissao.Rascunho) {
    return true;
  }
  
  // Admin pode excluir qualquer coisa
  if (userRole === 'admin') {
    return true;
  }
  
  return false;
};

export const getAvailableActions = (submission, userRole) => {
  const actions = [];
  
  // Ações baseadas no status e permissões
  switch (submission.status) {
    case StatusSubmissao.Rascunho:
      actions.push('enviar');
      if (canEdit(submission, userRole)) {
        actions.push('editar');
      }
      if (canDelete(submission, userRole)) {
        actions.push('excluir');
      }
      break;
      
    case StatusSubmissao.Enviado:
      if (userRole === 'admin' || userRole === 'gestor') {
        actions.push('aprovar', 'rejeitar');
      }
      actions.push('cancelar');
      break;
      
    case StatusSubmissao.EmAnalise:
      if (userRole === 'admin' || userRole === 'gestor') {
        actions.push('aprovar', 'rejeitar');
      }
      break;
      
    case StatusSubmissao.Aprovado:
      // Aprovados não podem ser alterados
      break;
      
    case StatusSubmissao.Rejeitado:
    case StatusSubmissao.Cancelado:
      if (canDelete(submission, userRole)) {
        actions.push('excluir');
      }
      break;
  }
  
  return actions;
};