import React from 'react';
import { Snackbar, Alert, AlertTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useAppStore } from '@/stores/useAppStore';

function SlideTransition(props: TransitionProps & { children: React.ReactElement<any, any> }) {
  return <Slide {...props} direction="up" />;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { notifications, removeNotification } = useAppStore();

  const handleClose = (id: string) => {
    removeNotification(id);
  };

  return (
    <>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHide !== false ? 6000 : null}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          TransitionComponent={SlideTransition}
          sx={{
            mt: 8, // 避免被AppBar遮挡
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{
              width: '100%',
              minWidth: 300,
              maxWidth: 500,
            }}
          >
            {notification.title && (
              <AlertTitle sx={{ fontWeight: 600 }}>
                {notification.title}
              </AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationProvider;
