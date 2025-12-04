import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import ThemeSwitcher from './ThemeSwitcher';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Главная', path: '/' },
    { label: 'Все технологии', path: '/technologies' },
    { label: 'Добавить технологию', path: '/technologies/add' },
    { label: 'Статистика', path: '/statistics' },
    { label: 'Настройки', path: '/settings' }
  ];

  const currentTabIndex = tabs.findIndex(
    tab => location.pathname === tab.path
  );

  const handleChange = (event, newValue) => {
    navigate(tabs[newValue].path);
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Tabs
        value={currentTabIndex !== -1 ? currentTabIndex : false}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="navigation tabs"
        sx={{ flexGrow: 1 }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      <ThemeSwitcher />
    </Box>
  );
}

export default Navigation;
