import React, { useState, useMemo } from 'react';
import {
  Grid,
  Box,
  LinearProgress,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  InputAdornment,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import useTechnologiesApi from '../hooks/useTechnologiesApi.ts';
import TechnologyCard from '../components/TechnologyCard.jsx';
import DebounceInput from '../components/DebounceInput.jsx';

function Home() {
  const {
    technologies = [],
    updateStatus
  } = useTechnologiesApi();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;

    const progress = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, inProgress, notStarted, progress };
  }, [technologies]);

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech) => {
      const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter
        = statusFilter === 'all' || tech.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [technologies, searchQuery, statusFilter]);

  // Обработчик изменения статуса
  const handleStatusChange = (techId, newStatus) => {
    updateStatus(techId, newStatus);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Заголовок и прогресс */}
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center" sx={{ mb: 4 }}>
        Прогресс изучения
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography>
              Всего технологий:
              {' '}
              <strong>{stats.total}</strong>
            </Typography>
            <Typography>
              Изучено:
              {' '}
              <strong>{stats.completed}</strong>
            </Typography>
            <Typography>
              Не начато:
              {' '}
              <strong>{stats.notStarted}</strong>
            </Typography>
            <Typography>
              В процессе:
              {' '}
              <strong>{stats.inProgress}</strong>
            </Typography>
          </Box>

          <Box>
            <LinearProgress
              variant="determinate"
              value={stats.progress}
              sx={{
                'height': 12,
                'borderRadius': 6,
                'backgroundColor': '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50',
                  borderRadius: 6
                }
              }}
            />
            <Typography align="center" sx={{ mt: 1, fontWeight: 'medium' }}>
              {stats.progress.toFixed(0)}
              % завершено
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Поиск и фильтры */}
      <Box sx={{ p: 2, mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <DebounceInput
            fullWidth
            size="small"
            placeholder="Поиск технологий..."
            value={searchQuery}
            onChange={setSearchQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ maxWidth: 400 }}
          />

          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, value) => value && setStatusFilter(value)}
            aria-label="фильтр по статусу"
          >
            <ToggleButton value="all">Все</ToggleButton>
            <ToggleButton value="not-started">Не начато</ToggleButton>
            <ToggleButton value="in-progress">В процессе</ToggleButton>
            <ToggleButton value="completed">Выполнено</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Карточки технологий */}
      <Grid container spacing={{ sm: 3 }} justifyContent="center">
        {filteredTechnologies.map(tech => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={tech.id}>
            <TechnologyCard
              technology={tech}
              onStatusChange={handleStatusChange}
            />
          </Grid>
        ))}
      </Grid>

      {/* Сообщение, если ничего не найдено */}
      {filteredTechnologies.length === 0 && (
        <Box textAlign="center" mt={8}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Ничего не найдено
          </Typography>
          <Typography color="text.secondary">
            Попробуйте изменить поиск или фильтры
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Home;
