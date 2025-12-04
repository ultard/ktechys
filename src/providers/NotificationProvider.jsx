import React, { useState, useCallback, useMemo } from 'react';
import { NotificationContext } from '../hooks/useNotification.ts';

import {
  Snackbar,
  Alert,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';

import {
  Close as CloseIcon,
  CheckCircle,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export const NotificationProvider = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info',
    duration: 0,
    action: null,
    vertical: 'top',
    horizontal: 'center'
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  const showNotification = useCallback(
    (options = {}) => {
      setNotification(prev => ({
        ...prev,
        open: true,
        duration: 2000,
        vertical: isMobile ? 'bottom' : 'top',
        horizontal: isMobile ? 'center' : 'right',
        ...options
      }));
    },
    [isMobile]
  );

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway') return;
      hideNotification();
    },
    [hideNotification]
  );

  const showSuccess = useCallback(
    (message, options = {}) => showNotification({ message, type: 'success', ...options }),
    [showNotification]
  );

  const showError = useCallback(
    (message, options = {}) => showNotification({ message, type: 'error', ...options }),
    [showNotification]
  );

  const showWarning = useCallback(
    (message, options = {}) => showNotification({ message, type: 'warning', ...options }),
    [showNotification]
  );

  const showInfo = useCallback(
    (message, options = {}) => showNotification({ message, type: 'info', ...options }),
    [showNotification]
  );

  const value = useMemo(
    () => ({
      showNotification,
      hideNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }),
    [showNotification, hideNotification, showSuccess, showError, showWarning, showInfo]
  );

  /** Transition with correct direction */
  const SlideTransition = useCallback(
    (props) => {
      const direction = notification.horizontal === 'right' ? 'left' : 'up';
      return <Slide {...props} direction={direction} />;
    },
    [notification.horizontal]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <Snackbar
        open={notification.open}
        autoHideDuration={notification.duration}
        onClose={handleClose}
        anchorOrigin={{
          vertical: notification.vertical,
          horizontal: notification.horizontal
        }}
        slots={{ transition: SlideTransition }}
        slotProps={{
          transition: {
            appear: true
          }
        }}
        sx={{
          [theme.breakpoints.down('sm')]: {
            bottom: 80
          }
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={notification.type}
          icon={getIcon(notification.type)}
          action={(
            <>
              {notification.action}
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
                sx={{ ml: 0.5 }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
          sx={{
            'width': '100%',
            'maxWidth': isMobile ? 'calc(100vw - 32px)' : 400,
            '& .MuiAlert-message': {
              flex: 1,
              paddingRight: 1
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
