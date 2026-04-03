import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Verificar tarefas próximas do vencimento e enviar notificações
   * Procura por tarefas com vencimento nos próximos 24 horas que ainda não foram notificadas
   */
  async checkAndNotifyUpcomingTasks() {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Encontrar tarefas que vencem em breve e não foram notificadas
    const upcomingTasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: twentyFourHoursLater,
        },
        status: 'TODO', // Apenas tarefas não iniciadas
        notificationSent: false,
      },
      include: {
        user: true,
      },
    });

    const results = [];

    for (const task of upcomingTasks) {
      // Aqui você integraria com serviço de push real (Firebase Cloud Messaging, etc)
      // Por enquanto, apenas marcamos como notificado
      try {
        // TODO: Implementar lógica real de Push Notification
        // const subscription = await this.getUserPushSubscription(task.userId);
        // if (subscription) {
        //   await this.sendPushNotification(subscription, {
        //     title: 'Tarefa Vencendo',
        //     body: `${task.title} vence em menos de 24 horas`,
        //     icon: '/icon-192x192.png',
        //     badge: '/icon-72x72.png',
        //   });
        // }

        // Marcar como notificado
        const updated = await this.prisma.task.update({
          where: { id: task.id },
          data: {
            notificationSent: true,
            notificationSentAt: new Date(),
          },
        });

        results.push({
          taskId: task.id,
          status: 'notified',
          task: updated,
        });
      } catch (error) {
        this.logger.error(`Failed to notify for task ${task.id}`, error);
        results.push({
          taskId: task.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      total: upcomingTasks.length,
      processed: results,
    };
  }

  /**
   * Obter status das notificações pendentes para um usuário específico
   * Retorna tarefas que vencem nos próximos 24h e ainda não foram notificadas
   */
  async getPendingNotifications(userId: string) {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId, // Filter by the authenticated user
        dueDate: {
          gte: now,
          lte: twentyFourHoursLater,
        },
        status: 'TODO',
        notificationSent: false,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
      },
    });

    // Transform to match frontend expected format
    return tasks.map((task) => ({
      taskId: task.id,
      taskTitle: task.title,
      type: 'upcoming_task' as const,
    }));
  }

  /**
   * Reset notificação para uma tarefa específica
   * Útil se a data de vencimento foi alterada
   */
  async resetNotification(taskId: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        notificationSent: false,
        notificationSentAt: null,
      },
    });
  }

  /**
   * Placeholder para integração com serviço de push real
   */
  private async sendPushNotification(
    subscription: PushSubscription,
    payload: { title: string; body: string; icon?: string; badge?: string },
  ) {
    // Implementar com Firebase Cloud Messaging ou Web Push API
    // Exemplo com web-push:
    // const webpush = require('web-push');
    // await webpush.sendNotification(subscription, JSON.stringify(payload));
    this.logger.debug('Push notification would be sent', {
      endpoint: subscription.endpoint,
      payload,
    });
  }

  /**
   * Placeholder para obter subscription do usuário
   */
  // eslint-disable-next-line no-unused-vars
  private async getUserPushSubscription(_userId: string): Promise<PushSubscription | null> {
    // Implementar lógica para obter subscription armazenada no banco
    // Por enquanto retorna null
    return null;
  }
}
