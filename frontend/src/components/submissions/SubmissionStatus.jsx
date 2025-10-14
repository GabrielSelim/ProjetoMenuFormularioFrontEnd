import React from 'react';
import { Chip } from '@mui/material';
import { getStatusLabel, getStatusColor } from '../../api/submissionService';

const SubmissionStatus = ({ status, onClick = null, disabled = false }) => {
  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
      onClick={onClick && !disabled ? onClick : undefined}
      clickable={!!onClick && !disabled}
      style={{ 
        cursor: (onClick && !disabled) ? 'pointer' : 'default',
        minWidth: '90px'
      }}
    />
  );
};

export default SubmissionStatus;