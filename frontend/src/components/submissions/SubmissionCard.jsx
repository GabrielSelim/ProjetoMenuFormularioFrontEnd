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
  Tooltip,
  Chip
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
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header com Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" component="h3" sx={{ 
              fontSize: { xs: '1.125rem', md: '1rem' },
              lineHeight: 1.3,
              mb: 0.5
            }}>
              {submission.formName}
            </Typography>
            <Chip 
              label={`Formulário v${submission.formVersion || '1.0'}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                fontSize: '0.65rem',
                height: 18,
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>
          <SubmissionStatus status={submission.status} />
        </Box>

        {/* Layout responsivo das informações */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 1, md: 2 },
          mb: 1
        }}>
          {/* Coluna 1 */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
              <strong>ID:</strong> {submission.id}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
              <strong>Usuário:</strong> {submission.userName}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
              <strong>Criado:</strong> {new Date(submission.createdAt).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>

          {/* Coluna 2 */}
          <Box>
            {submission.dataSubmissao && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                <strong>Submetido:</strong> {new Date(submission.dataSubmissao).toLocaleDateString('pt-BR')}
              </Typography>
            )}

            {submission.dataAprovacao && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                <strong>Aprovado:</strong> {new Date(submission.dataAprovacao).toLocaleDateString('pt-BR')}
              </Typography>
            )}

            {submission.motivoRejeicao && (
              <Typography variant="body2" color="error" sx={{ 
                mb: 0.5, 
                fontSize: '0.75rem',
                wordBreak: 'break-word'
              }}>
                <strong>Rejeição:</strong> {submission.motivoRejeicao}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ 
        justifyContent: 'space-between', 
        pt: 0, 
        px: 2, 
        pb: 1,
        minHeight: { xs: 'auto', md: 48 }
      }}>
        {/* Ações Principais */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Visualizar">
            <IconButton 
              size="small" 
              onClick={() => handleAction('view')}
              color="primary"
              sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          {availableActions.includes('editar') && (
            <Tooltip title="Editar">
              <IconButton 
                size="small" 
                onClick={() => handleAction('edit')}
                color="primary"
                sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {availableActions.includes('enviar') && (
            <Tooltip title="Enviar">
              <Button
                size="small"
                startIcon={<Send fontSize="small" />}
                onClick={() => handleAction('enviar')}
                color="primary"
                sx={{ 
                  fontSize: { xs: '0.75rem', md: '0.6875rem' },
                  minWidth: { xs: 'auto', md: 60 }
                }}
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
              sx={{ fontSize: { xs: '1rem', md: '0.875rem' } }}
            >
              <MoreVert fontSize="small" />
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