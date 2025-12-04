import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  Alert,
  Box,
  Divider
} from '@mui/material';

import {
  DeleteForever as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

import useTechnologiesApi from '../hooks/useTechnologiesApi';
import useNotification from '../hooks/useNotification.ts';

export default function Settings() {
  const { resetAll, exportData, importData } = useTechnologiesApi();
  const { showSuccess, showError } = useNotification();

  const [dragOver, setDragOver] = useState(false);

  const handleExport = () => {
    exportData();
    navigator.clipboard.writeText(JSON.stringify({
      exportedAt: new Date().toISOString(),
      message: 'Данные экспортированы из TechTracker'
    }, null, 2));
    showSuccess('Данные экспортированы и скопированы в буфер обмена.');
  };

  const handleReset = () => {
    if (window.confirm('Вы уверены? Все технологии будут удалены НАВСЕГДА!')) {
      resetAll();
      showSuccess('Все данные успешно удалены.');
    }
  };

  const handleImportFile = async (file) => {
    if (!file) return;
    try {
      const importedCount = await importData(file);

      showSuccess(`Импорт завершён. Добавлено новых технологий: ${importedCount}`);
    }
    catch (err) {
      console.error(err);
      showError('Ошибка при импорте файла. Проверьте корректность JSON.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files.length > 0) {
      handleImportFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4} mt={4}>
        {/* Очистка */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" color="error" gutterBottom>
              <DeleteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Очистить все данные
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Alert severity="warning">
              Это действие
              {' '}
              <strong>необратимо</strong>
              . Все технологии, заметки и прогресс будут удалены навсегда.
            </Alert>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleReset}
              fullWidth
            >
              Удалить все технологии
            </Button>
          </CardActions>
        </Card>

        {/* Экспорт */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              <UploadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Экспорт данных
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info">
              Скачайте резервную копию всех ваших технологий в формате JSON. Файл автоматически сохранится, а метаданные скопируются в буфер обмена.
            </Alert>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<UploadIcon />}
              onClick={handleExport}
              fullWidth
            >
              Экспортировать в JSON
            </Button>
          </CardActions>
        </Card>

        {/* Импорт через Drag & Drop */}
        <Card
          elevation={3}
          sx={{
            border: dragOver ? '2px dashed #1976d2' : undefined,
            backgroundColor: dragOver ? 'rgba(25, 118, 210, 0.1)' : undefined
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent>
            <Typography variant="h5" color="success" gutterBottom>
              <DownloadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Импорт данных
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info">
              Перетащите JSON-файл сюда или нажмите кнопку для выбора файла. Новые технологии будут добавлены к существующим.
            </Alert>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<DownloadIcon />}
              component="label"
              fullWidth
            >
              Выбрать файл JSON
              <input
                type="file"
                accept=".json"
                hidden
                onChange={e => e.target.files && handleImportFile(e.target.files[0])}
              />
            </Button>
          </CardActions>
        </Card>
      </Stack>

      <Box mt={8} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          TechTracker © 2025
        </Typography>
      </Box>
    </Container>
  );
}
