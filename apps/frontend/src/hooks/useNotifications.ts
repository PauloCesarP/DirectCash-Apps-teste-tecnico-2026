'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { notificationsAPI } from '@/lib/api';

type NotificationPermissionType = 'default' | 'granted' | 'denied';
type NotificationOptions = {
  badge?: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  [key: string]: any;
};

interface PendingNotification {
  taskId: string;
  taskTitle?: string;
  type: 'upcoming_task' | 'subtask_created' | 'task_completed';
}

interface NotificationHookReturn {
  permission: NotificationPermissionType;
  isSupported: boolean;
  pendingNotifications: PendingNotification[];
  isPolling: boolean;
  requestPermission: () => Promise<NotificationPermissionType>;
  // eslint-disable-next-line
  sendNotification: (title: string, options?: NotificationOptions) => void;
  registerServiceWorker: () => Promise<ServiceWorkerRegistration | null>;
  // eslint-disable-next-line
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
  clearNotifications: () => void;
  // eslint-disable-next-line
  resetNotification: (taskId: string) => Promise<void>;
}

export function useNotifications(): NotificationHookReturn {
  const [permission, setPermission] = useState<NotificationPermissionType>(
    'default',
  );
  const [isSupported, setIsSupported] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState<
    PendingNotification[]
  >([]);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Verificar suporte a notificações
    const supported =
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator;

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const sendNotificationHandler = useCallback(
    (title: string, options?: NotificationOptions): void => {
      if (!isSupported || permission !== 'granted') {
        console.warn('Notifications not permitted');
        return;
      }

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          options,
        });
      } else {
        // Fallback: mostrar notificação diretamente
        new Notification(title, options);
      }
    },
    [isSupported, permission],
  );

  const fetchPendingNotifications = useCallback(async () => {
    try {
      const response = await notificationsAPI.getPending();
      if (response.data && Array.isArray(response.data)) {
        setPendingNotifications(response.data);

        // Show browser notification for each new pending notification
        response.data.forEach((notification: PendingNotification) => {
          sendNotificationHandler(`Tarefa: ${notification.taskTitle || 'Sem título'}`, {
            badge: '/icon-72x72.png',
            icon: '/icon-192x192.png',
            tag: `notification-${notification.taskId}`,
            requireInteraction: false,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching pending notifications:', error);
    }
  }, [sendNotificationHandler]);

  const registerServiceWorker = async (): Promise<
    ServiceWorkerRegistration | null
  > => {
    if (!isSupported) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };

  const requestPermission = async (): Promise<NotificationPermissionType> => {
    if (!isSupported) {
      console.warn('Notifications not supported in this browser');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await registerServiceWorker();
        // Start polling after permission granted
        startPolling();
      }

      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const sendNotification = sendNotificationHandler;

  const startPolling = useCallback((intervalMs: number = 30000) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    setIsPolling(true);

    // Fetch immediately
    fetchPendingNotifications();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchPendingNotifications();
    }, intervalMs);
  }, [fetchPendingNotifications]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const clearNotifications = useCallback(() => {
    setPendingNotifications([]);
  }, []);

  const resetNotification = useCallback(async (taskId: string) => {
    try {
      await notificationsAPI.resetNotification(taskId);
      // Remove from local state
      setPendingNotifications((prev) =>
        prev.filter((n) => n.taskId !== taskId),
      );
    } catch (error) {
      console.error('Error resetting notification:', error);
    }
  }, []);

  return {
    permission,
    isSupported,
    pendingNotifications,
    isPolling,
    requestPermission,
    sendNotification,
    registerServiceWorker,
    startPolling,
    stopPolling,
    clearNotifications,
    resetNotification,
  };
}
