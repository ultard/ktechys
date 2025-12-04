import React, { createContext, useContext } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ShowNotificationOptions {
  message?: string;
  type?: NotificationType;
  duration?: number;
  action?: React.ReactNode;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

export interface NotificationContextValue {
  showNotification: (options: ShowNotificationOptions) => void;

  showSuccess: (message: string, options?: Partial<ShowNotificationOptions>) => void;
  showError: (message: string, options?: Partial<ShowNotificationOptions>) => void;
  showWarning: (message: string, options?: Partial<ShowNotificationOptions>) => void;
  showInfo: (message: string, options?: Partial<ShowNotificationOptions>) => void;

  hideNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export default useNotification;
