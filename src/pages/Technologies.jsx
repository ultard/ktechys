import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  RadioButtonUnchecked as NotStartedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi.ts';

function TechnologiesListPage() {
  const navigate = useNavigate();
  const { technologies = [], loading, error } = useTechnologiesApi();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'in-progress':
        return <PendingIcon color="warning" fontSize="small" />;
      default:
        return <NotStartedIcon color="action" fontSize="small" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  const handleEditClick = (techId) => {
    navigate(`/technologies/edit?id=${techId}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Загрузка технологий...
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка загрузки:
          {' '}
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Заголовок */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Все технологии (
        {technologies.length}
        )
      </Typography>

      {/* Статистика */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">Всего:</Typography>
            <Typography variant="h6">{technologies.length}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Завершено:</Typography>
            <Typography variant="h6" color="success.main">
              {technologies.filter(t => t.status === 'completed').length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">В процессе:</Typography>
            <Typography variant="h6" color="warning.main">
              {technologies.filter(t => t.status === 'in-progress').length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Не начато:</Typography>
            <Typography variant="h6">
              {technologies.filter(t => t.status === 'not-started').length}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Таблица технологий */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 'bold', width: '50px' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Категория</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Сложность</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technologies.map((tech, index) => (
              <TableRow
                key={tech.id}
                hover
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  'cursor': 'pointer'
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {tech.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {tech.description && tech.description.length > 60
                        ? `${tech.description.substring(0, 60)}...`
                        : tech.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={tech.category}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(tech.status)}
                    <Chip
                      label={getStatusText(tech.status)}
                      color={getStatusColor(tech.status)}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={tech.difficulty || 'не указано'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Редактировать">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(tech.id)}
                      sx={{ minWidth: 'auto' }}
                    >
                      Редакт.
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {technologies.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Технологий не найдено. Добавьте первую технологию!
        </Alert>
      )}
    </Box>
  );
}

export default TechnologiesListPage;
