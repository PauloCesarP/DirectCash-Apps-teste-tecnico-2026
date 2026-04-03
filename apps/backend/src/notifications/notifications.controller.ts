import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Verificar tarefas próximas do vencimento e enviar notificações
   */
  @Post('check-upcoming')
  @HttpCode(HttpStatus.OK)
  async checkUpcomingTasks() {
    return this.notificationsService.checkAndNotifyUpcomingTasks();
  }

  /**
   * Obter lista de notificações pendentes para o usuário autenticado
   */
  @Get('pending')
  async getPendingNotifications(@Request() req) {
    return this.notificationsService.getPendingNotifications(req.user.userId);
  }

  /**
   * Reset de notificação para uma tarefa
   */
  @Post('reset/:taskId')
  async resetNotification(@Param('taskId') taskId: string) {
    return this.notificationsService.resetNotification(taskId);
  }
}

