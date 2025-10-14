import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Send,
  CheckCircle,
  Cancel,
  MoreVert,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import SubmissionStatus from './SubmissionStatus';
import { getAvailableActions } from '../../api/submissionService';

const SubmissionCard = ({ 
  submission, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onWorkflowAction 
}) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const availableActions = getAvailableActions(submission, user?.role);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    switch (action) {
      case 'view':
        onView(submission.id);
        break;
      case 'edit':
        onEdit(submission.id);
        break;
      case 'delete':
        onDelete(submission.id);
        break;
      case 'enviar':
        onWorkflowAction(submission.id, 'enviar');
        break;
      case 'aprovar':
        onWorkflowAction(submission.id, 'aprovar');
        break;
      case 'rejeitar':
        onWorkflowAction(submission.id, 'rejeitar');
        break;
      case 'cancelar':
        onWorkflowAction(submission.id, 'cancelar');
        break;
      case 'colocarAnalise':
        onWorkflowAction(submission.id, 'colocarAnalise');
        break;
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      view: <Visibility />,
      edit: <Edit />,
      delete: <Delete />,
      enviar: <Send />,
      aprovar: <CheckCircle />,
      rejeitar: <Cancel />,
      cancelar: <Cancel />,
      colocarAnalise: <Assignment />
    };
    return icons[action] || <MoreVert />;
  };

  const getActionLabel = (action) => {
    const labels = {
      view: 'Visualizar',
      edit: 'Editar',
      delete: 'Excluir',
      enviar: 'Enviar',
      aprovar: 'Aprovar',
      rejeitar: 'Rejeitar',
      cancelar: 'Cancelar',
      colocarAnalise: 'Colocar em Análise'
    };
    return labels[action] || action;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header com Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 2 }}>
            {submission.formName}
          </Typography>
          <SubmissionStatus status={submission.status} />
        </Box>

        {/* Informações Básicas */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>ID:</strong> {submission.id}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Usuário:</strong> {submission.userName}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Criado em:</strong> {new Date(submission.createdAt).toLocaleDateString('pt-BR')}
        </Typography>

        {submission.dataSubmissao && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Submetido em:</strong> {new Date(submission.dataSubmissao).toLocaleDateString('pt-BR')}
          </Typography>
        )}

        {submission.dataAprovacao && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Aprovado em:</strong> {new Date(submission.dataAprovacao).toLocaleDateString('pt-BR')}
          </Typography>
        )}

        {submission.motivoRejeicao && (
          <Typography variant="body2" color="error" gutterBottom>
            <strong>Motivo Rejeição:</strong> {submission.motivoRejeicao}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        {/* Ações Principais */}
        <Box>
          <Tooltip title="Visualizar">
            <IconButton 
              size="small" 
              onClick={() => handleAction('view')}
              color="primary"
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          {availableActions.includes('editar') && (
            <Tooltip title="Editar">
              <IconButton 
                size="small" 
                onClick={() => handleAction('edit')}
                color="primary"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}

          {availableActions.includes('enviar') && (
            <Tooltip title="Enviar">
              <Button
                size="small"
                startIcon={<Send />}
                onClick={() => handleAction('enviar')}
                color="primary"
              >
                Enviar
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Menu de Ações Secundárias */}
        {availableActions.length > 2 && (
          <Box>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              aria-label="mais ações"
            >
              <MoreVert />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 180 }
              }}
            >
              {availableActions.map((action) => (
                <MenuItem 
                  key={action} 
                  onClick={() => handleAction(action)}
                  sx={{ 
                    color: action === 'delete' || action === 'rejeitar' || action === 'cancelar' 
                      ? 'error.main' 
                      : 'inherit' 
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: action === 'delete' || action === 'rejeitar' || action === 'cancelar' 
                      ? 'error.main' 
                      : 'inherit' 
                  }}>
                    {getActionIcon(action)}
                  </ListItemIcon>
                  <ListItemText>{getActionLabel(action)}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default SubmissionCard;