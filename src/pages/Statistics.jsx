import { useMemo } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import useTechnologiesApi from '../hooks/useTechnologiesApi.ts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#9933FF'];

export default function Statistics() {
  const { technologies, loading, error } = useTechnologiesApi();
  const totalTechnologies = technologies.length;

  const monthlyData = useMemo(() => {
    const counts = {};
    technologies.forEach((tech) => {
      const month = tech.deadline ? new Date(tech.deadline).toLocaleString('default', { month: 'short' }) : 'Без срока';
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([month, count]) => ({ month, count }));
  }, [technologies]);

  const categoryData = useMemo(() => {
    const counts = {};
    technologies.forEach((tech) => {
      const cat = tech.category || 'Другие';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [technologies]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return (
    <Typography color="error">
      Ошибка:
      {error}
    </Typography>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Статистика технологий
      </Typography>

      <Grid container spacing={3}>
        {/* Общее количество */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Общее количество технологий</Typography>
            <Typography variant="h3" color="primary">{totalTechnologies}</Typography>
          </Paper>
        </Grid>

        {/* Линейный график по месяцам */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Дедлайны технологий по месяцам</Typography>
            <LineChart width={600} height={300} data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={3} />
            </LineChart>
          </Paper>
        </Grid>

        {/* Круговая диаграмма по категориям */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Распределение по категориям</Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
