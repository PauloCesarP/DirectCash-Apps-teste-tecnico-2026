import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, data: CreateTaskDto) {
    this.logger.debug(`Creating task for user: ${userId}`, { userId, data });

    if (!userId) {
      throw new BadRequestException('User ID is missing from authentication token');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      throw new BadRequestException('User not found. Please login again.');
    }

    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getTasks(userId: string, filters?: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    return this.prisma.task.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getTaskById(id: string, userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, userId: string, data: UpdateTaskDto) {
    // eslint-disable-next-line no-unused-vars
    const task = await this.getTaskById(id, userId);

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string, userId: string) {
    // eslint-disable-next-line no-unused-vars
    const task = await this.getTaskById(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getProductivityAnalytics(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Pegar dados dos últimos 7 dias
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Buscar todas as tarefas completadas na semana
    const completedTasks = await this.prisma.task.findMany({
      where: {
        userId,
        status: 'DONE',
        updatedAt: {
          gte: sevenDaysAgo,
          lte: new Date(),
        },
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        priority: true,
      },
    });

    // Agrupar por dia
    const dailyData: Record<string, { date: string; completed: number; tasks: any[] }> = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      
      dailyData[dateStr] = {
        date: dayName,
        completed: 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tasks: [] as any[],
      };
    }

    // Contar tarefas completadas por dia
    for (const task of completedTasks) {
      const taskDate = new Date(task.updatedAt);
      taskDate.setHours(0, 0, 0, 0);
      const dateStr = taskDate.toISOString().split('T')[0];

      if (dailyData[dateStr]) {
        dailyData[dateStr].completed += 1;
        dailyData[dateStr].tasks.push(task);
      }
    }

    // Converter para array
    const data = Object.values(dailyData);

    // Estatísticas resumidas
    const totalCompleted = completedTasks.length;
    const averagePerDay = totalCompleted > 0 ? (totalCompleted / 7).toFixed(1) : '0';
    const highPriorityCompleted = completedTasks.filter(
      (t) => t.priority === 'HIGH',
    ).length;

    return {
      period: 'last_7_days',
      data,
      stats: {
        totalCompleted,
        averagePerDay: parseFloat(averagePerDay as string),
        highPriorityCompleted,
        weekStart: sevenDaysAgo.toISOString().split('T')[0],
        weekEnd: today.toISOString().split('T')[0],
      },
    };
  }
}
