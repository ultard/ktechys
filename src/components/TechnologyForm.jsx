import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Stack,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip
} from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'frontend',
    difficulty: initialData.difficulty || 'beginner',
    deadline: initialData.deadline || '',
    resources: initialData.resources?.length ? initialData.resources : ['']
  });

  const errors = useMemo(() => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Название обязательно';
    }
    else if (formData.title.trim().length < 2) {
      errs.title = 'Минимум 2 символа';
    }
    else if (formData.title.trim().length > 50) {
      errs.title = 'Максимум 50 символов';
    }

    if (!formData.description.trim()) {
      errs.description = 'Описание обязательно';
    }
    else if (formData.description.trim().length < 10) {
      errs.description = 'Минимум 10 символов';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        errs.deadline = 'Дедлайн не может быть в прошлом';
      }
    }

    formData.resources.forEach((url, i) => {
      if (url.trim() && !/^https?:\/\//.test(url.trim())) {
        errs[`resource_${i}`] = 'URL должен начинаться с http:// или https://';
      }
    });

    return errs;
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({ ...prev, resources: newResources }));
  };

  const addResource = () => setFormData(prev => ({
    ...prev,
    resources: [...prev.resources, '']
  }));

  const removeResource = (index) => {
    if (formData.resources.length > 1) {
      setFormData(prev => ({
        ...prev,
        resources: prev.resources.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const cleaned = {
        ...formData,
        resources: formData.resources.filter(r => r.trim() !== '')
      };
      onSave(cleaned);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData.title ? 'Редактирование' : 'Новая технология'}
      </Typography>

      <Stack spacing={3}>
        <TextField
          required
          label="Название технологии"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
        />

        <TextField
          required
          label="Описание"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description || 'Минимум 10 символов'}
          multiline
          rows={4}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Категория</InputLabel>
          <Select name="category" value={formData.category} onChange={handleChange} label="Категория">
            <MenuItem value="frontend">Frontend</MenuItem>
            <MenuItem value="backend">Backend</MenuItem>
            <MenuItem value="database">База данных</MenuItem>
            <MenuItem value="devops">DevOps</MenuItem>
            <MenuItem value="other">Другое</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Сложность</InputLabel>
          <Select name="difficulty" value={formData.difficulty} onChange={handleChange} label="Сложность">
            <MenuItem value="beginner">Начальный</MenuItem>
            <MenuItem value="intermediate">Средний</MenuItem>
            <MenuItem value="advanced">Продвинутый</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Дедлайн"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={!!errors.deadline}
          helperText={errors.deadline}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom>Ресурсы</Typography>
          {formData.resources.map((url, i) => (
            <TextField
              key={i}
              fullWidth
              value={url}
              onChange={e => handleResourceChange(i, e.target.value)}
              placeholder="https://example.com"
              error={!!errors[`resource_${i}`]}
              helperText={errors[`resource_${i}`]}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Chip label={i + 1} size="small" /></InputAdornment>,
                  endAdornment: formData.resources.length > 1 && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => removeResource(i)} edge="end">
                        <DeleteIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          ))}
          <Button startIcon={<AddIcon />} onClick={addResource} variant="outlined" size="small" sx={{ mt: 1 }}>
            Добавить ресурс
          </Button>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" type="submit" disabled={!isFormValid}>
            Сохранить
          </Button>
          <Button variant="outlined" onClick={onCancel}>Отмена</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default TechnologyForm;
