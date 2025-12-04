import { IconButton, Tooltip } from '@mui/material';

import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

import { useThemeMode } from '../providers/MuiProvider';

export default function ThemeSwitcher() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title="Переключить тему">
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
