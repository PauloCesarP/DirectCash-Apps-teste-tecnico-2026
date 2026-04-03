'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationCenter() {
  const {
    permission,
    isSupported,
    pendingNotifications,
    isPolling,
    requestPermission,
    resetNotification,
  } = useNotifications();

  useEffect(() => {
    // Request permission on mount if supported
    if (isSupported && permission === 'default') {
      requestPermission();
    }
  }, [isSupported, permission, requestPermission]);

  if (!isSupported) {
    return null; // Notifications not supported
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Permission banner */}
      {permission === 'denied' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Notificações desabilitadas. Ative nas configurações do navegador.
          </p>
        </div>
      )}

      {permission === 'default' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <button
            onClick={() => requestPermission()}
            className="text-blue-800 dark:text-blue-200 text-sm font-medium hover:underline"
          >
            Ativar notificações
          </button>
        </div>
      )}

      {/* Notifications list */}
      {permission === 'granted' && pendingNotifications.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-900 dark:text-green-100 font-semibold text-sm">
              Notificações Pendentes ({pendingNotifications.length})
            </h3>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isPolling
                  ? 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              }`}
            >
              {isPolling ? '🔄 Ativo' : '⏸️ Parado'}
            </span>
          </div>
          <div className="space-y-2">
            {pendingNotifications.map((notification) => (
              <div
                key={notification.taskId}
                className="bg-white dark:bg-gray-800 rounded p-3 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.taskTitle || 'Tarefa sem título'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {notification.type === 'upcoming_task' && 'Vence em breve'}
                    {notification.type === 'subtask_created' && 'Subtarefa criada'}
                    {notification.type === 'task_completed' && 'Tarefa concluída'}
                  </p>
                </div>
                <button
                  onClick={() => resetNotification(notification.taskId)}
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  title="Descartar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Polling status indicator */}
      {permission === 'granted' && !isPolling && pendingNotifications.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            ✓ Notificações monitoradas
          </p>
        </div>
      )}
    </div>
  );
}
